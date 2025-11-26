package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.domain.entity.*;
import ITS.com.vn.assessment_service.domain.enums.AttemptStatus;
import ITS.com.vn.assessment_service.domain.enums.QuestionType;
import ITS.com.vn.assessment_service.dto.request.AnswerRequest;
import ITS.com.vn.assessment_service.dto.request.AttemptSubmitRequest;
import ITS.com.vn.assessment_service.dto.response.AttemptResultResponse;
import ITS.com.vn.assessment_service.dto.response.AttemptStartResponse;
import ITS.com.vn.assessment_service.dto.response.AttemptSubmitResponse;
import ITS.com.vn.assessment_service.mapper.AttemptMapper;
import ITS.com.vn.assessment_service.repository.*;
import ITS.com.vn.assessment_service.service.AttemptService;
import ITS.com.vn.assessment_service.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AttemptServiceImpl implements AttemptService {

    private final AttemptRepository attemptRepository;
    private final ExamConfigRepository examConfigRepository;
    private final QuestionRepository questionRepository;
    private final GradebookRepository gradebookRepository;
    private final AttemptMapper attemptMapper;

    @Override
    public AttemptStartResponse startAttempt(Long examConfigId) {
        UUID userId = JwtUtil.getUserIdFromJwt();

        ExamConfig examConfig = examConfigRepository.findById(examConfigId)
                .orElseThrow(() -> new EntityNotFoundException("Exam config not found"));

        // Check if user already has an in-progress attempt
        List<Attempt> existingAttempts = attemptRepository.findByStudentIdAndExamConfigId(userId, examConfigId);
        Optional<Attempt> inProgress = existingAttempts.stream()
                .filter(a -> a.getStatus() == AttemptStatus.IN_PROGRESS)
                .findFirst();

        if (inProgress.isPresent()) {
            throw new IllegalStateException("You already have an in-progress attempt for this exam");
        }

        // Create new attempt
        Attempt attempt = Attempt.builder()
                .studentId(userId)
                .examConfig(examConfig)
                .status(AttemptStatus.IN_PROGRESS)
                .startedAt(Instant.now())
                .build();

        attempt = attemptRepository.save(attempt);

        // Generate questions from pools
        for (ExamSectionRule rule : examConfig.getSections()) {
            List<Question> questions = questionRepository.findRandomQuestionsByPoolId(
                    rule.getPool().getId(), rule.getCountToPull());

            for (Question q : questions) {
                Answer answer = Answer.builder()
                        .attempt(attempt)
                        .question(q)
                        .build();
                attempt.getAnswers().add(answer);
            }
        }

        attempt = attemptRepository.save(attempt);

        return new AttemptStartResponse(
                attempt.getId(),
                examConfigId,
                attempt.getStartedAt(),
                examConfig.getTimeLimitMinutes());
    }

    @Override
    public AttemptSubmitResponse submitAttempt(Long attemptId, AttemptSubmitRequest request) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new EntityNotFoundException("Attempt not found"));

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new IllegalStateException("Attempt is already submitted");
        }

        Map<Long, AnswerRequest> answerMap = new HashMap<>();
        for (AnswerRequest ar : request.getAnswers()) {
            answerMap.put(ar.getQuestionId(), ar);
        }

        double totalScore = 0;
        boolean manualReviewNeeded = false;

        for (Answer answer : attempt.getAnswers()) {
            AnswerRequest req = answerMap.get(answer.getQuestion().getId());
            if (req != null) {
                answer.setResponse(req.getResponse());

                // Basic Grading Logic
                double score = gradeAnswer(answer, req.getResponse());
                answer.setScore(score);
                totalScore += score;

                // Check if manual review needed
                if (answer.getQuestion().getType() == QuestionType.ESSAY ||
                        answer.getQuestion().getType() == QuestionType.CODING) {
                    answer.setManualReviewNeeded(true);
                    manualReviewNeeded = true;
                }
            }
        }

        attempt.setSubmittedAt(Instant.now());
        attempt.setTotalScore(totalScore);
        attempt.setStatus(manualReviewNeeded ? AttemptStatus.UNDER_REVIEW : AttemptStatus.GRADED);
        attemptRepository.save(attempt);

        // Update Gradebook if graded
        if (attempt.getStatus() == AttemptStatus.GRADED) {
            updateGradebook(attempt);
        }

        AttemptSubmitResponse response = new AttemptSubmitResponse();
        response.setMessage("Submitted successfully");
        response.setSubmittedAt(attempt.getSubmittedAt());
        return response;
    }

    private double gradeAnswer(Answer answer, Object response) {
        Question q = answer.getQuestion();

        if (q.getType() != QuestionType.MCQ) {
            return 0.0; // Only auto-grade MCQ
        }

        // Simple MCQ check
        Map<String, Object> meta = q.getMetadata();
        if (meta != null && meta.containsKey("correct")) {
            Object correct = meta.get("correct");
            if (response.equals(correct)) {
                return q.getWeight(); // Full points
            }
        }
        return 0.0;
    }

    private void updateGradebook(Attempt attempt) {
        Gradebook gradebook = Gradebook.builder()
                .studentId(attempt.getStudentId())
                .courseId(attempt.getExamConfig().getCourseId())
                .examConfig(attempt.getExamConfig())
                .finalScore(attempt.getTotalScore())
                .status("PASSED") // Logic to determine pass/fail needed
                .gradedAt(Instant.now())
                .build();
        gradebookRepository.save(gradebook);
    }

    @Override
    public AttemptResultResponse getAttemptResult(Long attemptId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new EntityNotFoundException("Attempt not found"));

        if (attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
            throw new IllegalStateException("Attempt is not yet submitted");
        }

        AttemptResultResponse response = attemptMapper.toResultResponse(attempt);

        // Calculate max score
        double maxScore = attempt.getAnswers().stream()
                .mapToDouble(a -> a.getQuestion().getWeight())
                .sum();
        response.setMaxScore(maxScore);
        response.setPassed(attempt.getTotalScore() >= maxScore * 0.5); // 50% pass threshold

        return response;
    }
}
