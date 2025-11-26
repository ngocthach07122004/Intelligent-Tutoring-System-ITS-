package ITS.com.vn.assessment_service.service.impl;

import ITS.com.vn.assessment_service.domain.entity.Question;
import ITS.com.vn.assessment_service.domain.entity.QuestionPool;
import ITS.com.vn.assessment_service.dto.request.QuestionRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionResponse;
import ITS.com.vn.assessment_service.mapper.QuestionMapper;
import ITS.com.vn.assessment_service.repository.QuestionPoolRepository;
import ITS.com.vn.assessment_service.repository.QuestionRepository;
import ITS.com.vn.assessment_service.service.QuestionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionPoolRepository questionPoolRepository;
    private final QuestionMapper questionMapper;

    @Override
    public QuestionResponse createQuestion(QuestionRequest request) {
        QuestionPool pool = questionPoolRepository.findById(request.getPoolId())
                .orElseThrow(() -> new EntityNotFoundException("Question Pool not found"));

        Question question = questionMapper.toEntity(request);
        question.setPool(pool);
        question = questionRepository.save(question);
        return questionMapper.toResponse(question);
    }

    @Override
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));

        if (!question.getPool().getId().equals(request.getPoolId())) {
            QuestionPool pool = questionPoolRepository.findById(request.getPoolId())
                    .orElseThrow(() -> new EntityNotFoundException("Question Pool not found"));
            question.setPool(pool);
        }

        questionMapper.updateEntityFromRequest(request, question);
        question = questionRepository.save(question);
        return questionMapper.toResponse(question);
    }

    @Override
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new EntityNotFoundException("Question not found");
        }
        questionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponse getQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));
        return questionMapper.toResponse(question);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByPool(Long poolId) {
        return questionRepository.findByPoolId(poolId).stream()
                .map(questionMapper::toResponse)
                .collect(Collectors.toList());
    }
}
