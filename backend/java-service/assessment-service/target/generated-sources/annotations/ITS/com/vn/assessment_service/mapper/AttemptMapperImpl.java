package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.entity.Answer;
import ITS.com.vn.assessment_service.domain.entity.Attempt;
import ITS.com.vn.assessment_service.domain.entity.ExamConfig;
import ITS.com.vn.assessment_service.domain.entity.Gradebook;
import ITS.com.vn.assessment_service.domain.entity.Question;
import ITS.com.vn.assessment_service.dto.response.AnswerResultResponse;
import ITS.com.vn.assessment_service.dto.response.AttemptResultResponse;
import ITS.com.vn.assessment_service.dto.response.GradebookResponse;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Microsoft)"
)
@Component
public class AttemptMapperImpl implements AttemptMapper {

    @Override
    public AttemptResultResponse toResultResponse(Attempt attempt) {
        if ( attempt == null ) {
            return null;
        }

        AttemptResultResponse attemptResultResponse = new AttemptResultResponse();

        attemptResultResponse.setAttemptId( attempt.getId() );
        attemptResultResponse.setScore( attempt.getTotalScore() );
        attemptResultResponse.setAnswers( answerListToAnswerResultResponseList( attempt.getAnswers() ) );

        return attemptResultResponse;
    }

    @Override
    public AnswerResultResponse toAnswerResultResponse(Answer answer) {
        if ( answer == null ) {
            return null;
        }

        AnswerResultResponse answerResultResponse = new AnswerResultResponse();

        answerResultResponse.setQuestionId( answerQuestionId( answer ) );
        answerResultResponse.setYourAnswer( answer.getResponse() );
        answerResultResponse.setScore( answer.getScore() );

        return answerResultResponse;
    }

    @Override
    public GradebookResponse toGradebookResponse(Gradebook gradebook) {
        if ( gradebook == null ) {
            return null;
        }

        GradebookResponse gradebookResponse = new GradebookResponse();

        gradebookResponse.setExamId( gradebookExamConfigId( gradebook ) );
        gradebookResponse.setExamTitle( gradebookExamConfigTitle( gradebook ) );
        gradebookResponse.setScore( gradebook.getFinalScore() );
        if ( gradebook.getStudentId() != null ) {
            gradebookResponse.setStudentId( gradebook.getStudentId().toString() );
        }
        gradebookResponse.setStatus( gradebook.getStatus() );
        gradebookResponse.setGradedAt( gradebook.getGradedAt() );

        return gradebookResponse;
    }

    protected List<AnswerResultResponse> answerListToAnswerResultResponseList(List<Answer> list) {
        if ( list == null ) {
            return null;
        }

        List<AnswerResultResponse> list1 = new ArrayList<AnswerResultResponse>( list.size() );
        for ( Answer answer : list ) {
            list1.add( toAnswerResultResponse( answer ) );
        }

        return list1;
    }

    private Long answerQuestionId(Answer answer) {
        if ( answer == null ) {
            return null;
        }
        Question question = answer.getQuestion();
        if ( question == null ) {
            return null;
        }
        Long id = question.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long gradebookExamConfigId(Gradebook gradebook) {
        if ( gradebook == null ) {
            return null;
        }
        ExamConfig examConfig = gradebook.getExamConfig();
        if ( examConfig == null ) {
            return null;
        }
        Long id = examConfig.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String gradebookExamConfigTitle(Gradebook gradebook) {
        if ( gradebook == null ) {
            return null;
        }
        ExamConfig examConfig = gradebook.getExamConfig();
        if ( examConfig == null ) {
            return null;
        }
        String title = examConfig.getTitle();
        if ( title == null ) {
            return null;
        }
        return title;
    }
}
