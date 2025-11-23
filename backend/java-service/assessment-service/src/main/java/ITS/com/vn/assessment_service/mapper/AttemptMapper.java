package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.entity.Answer;
import ITS.com.vn.assessment_service.domain.entity.Attempt;
import ITS.com.vn.assessment_service.domain.entity.Gradebook;
import ITS.com.vn.assessment_service.dto.response.AnswerResultResponse;
import ITS.com.vn.assessment_service.dto.response.AttemptResultResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttemptMapper {
    @Mapping(source = "id", target = "attemptId")
    @Mapping(source = "totalScore", target = "score")
    @Mapping(target = "maxScore", ignore = true) // Calculated in service
    @Mapping(target = "passed", ignore = true) // Calculated in service
    @Mapping(target = "feedback", ignore = true) // Calculated in service
    AttemptResultResponse toResultResponse(Attempt attempt);

    @Mapping(source = "question.id", target = "questionId")
    @Mapping(source = "response", target = "yourAnswer")
    @Mapping(target = "correct", ignore = true) // Calculated in service
    AnswerResultResponse toAnswerResultResponse(Answer answer);

    @Mapping(source = "examConfig.id", target = "examId")
    @Mapping(source = "examConfig.title", target = "examTitle")
    @Mapping(source = "finalScore", target = "score")
    @Mapping(source = "studentId", target = "studentId")
    @Mapping(target = "studentName", ignore = true)
    GradebookResponse toGradebookResponse(Gradebook gradebook);
}
