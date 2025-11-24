package ITS.com.vn.dashboard_service.service.consumer;

import ITS.com.vn.dashboard_service.config.RabbitMQConfig;
import ITS.com.vn.dashboard_service.domain.entity.StudentRiskProfile;
import ITS.com.vn.dashboard_service.domain.enums.RiskLevel;
import ITS.com.vn.dashboard_service.repository.StudentRiskProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardConsumer {

    private final StudentRiskProfileRepository riskProfileRepository;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_DASHBOARD_ANALYTICS)
    public void handleAnalyticsEvent(Map<String, Object> event) {
        log.info("Received analytics event: {}", event);
        // Simple logic for MVP: Check event type and update risk
        // In real impl, check headers or event structure to distinguish EXAM_GRADED vs
        // LESSON_COMPLETED

        try {
            if (event.containsKey("score")) {
                handleExamGraded(event);
            } else if (event.containsKey("lessonId")) {
                handleLessonCompleted(event);
            }
        } catch (Exception e) {
            log.error("Error processing event", e);
        }
    }

    private void handleExamGraded(Map<String, Object> event) {
        String studentIdStr = (String) event.get("studentId");
        Double score = Double.valueOf(event.get("score").toString());

        if (studentIdStr != null) {
            UUID studentId = UUID.fromString(studentIdStr);
            StudentRiskProfile profile = riskProfileRepository.findById(studentId)
                    .orElse(StudentRiskProfile.builder()
                            .studentId(studentId)
                            .riskLevel(RiskLevel.LOW)
                            .overallScore(0.0)
                            .build());

            if (score < 50.0) {
                profile.setRiskLevel(RiskLevel.HIGH);
                profile.getRiskFactors().add("FAILED_EXAM");
            }

            // Simple average update
            profile.setOverallScore((profile.getOverallScore() + score) / 2);
            riskProfileRepository.save(profile);
        }
    }

    private void handleLessonCompleted(Map<String, Object> event) {
        // Update engagement logic here
        log.info("Lesson completed event processed");
    }
}
