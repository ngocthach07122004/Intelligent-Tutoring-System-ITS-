package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.entity.Question;
import ITS.com.vn.assessment_service.domain.entity.QuestionPool;
import ITS.com.vn.assessment_service.dto.request.QuestionRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionResponse;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class QuestionMapperImpl implements QuestionMapper {

    @Override
    public Question toEntity(QuestionRequest request) {
        if ( request == null ) {
            return null;
        }

        Question question = new Question();

        question.setType( request.getType() );
        question.setContent( request.getContent() );
        Map<String, Object> map = request.getMetadata();
        if ( map != null ) {
            question.setMetadata( new LinkedHashMap<String, Object>( map ) );
        }
        question.setWeight( request.getWeight() );
        question.setSkillTag( request.getSkillTag() );

        return question;
    }

    @Override
    public QuestionResponse toResponse(Question entity) {
        if ( entity == null ) {
            return null;
        }

        QuestionResponse questionResponse = new QuestionResponse();

        questionResponse.setPoolId( entityPoolId( entity ) );
        questionResponse.setId( entity.getId() );
        questionResponse.setType( entity.getType() );
        questionResponse.setContent( entity.getContent() );
        Map<String, Object> map = entity.getMetadata();
        if ( map != null ) {
            questionResponse.setMetadata( new LinkedHashMap<String, Object>( map ) );
        }
        questionResponse.setWeight( entity.getWeight() );
        questionResponse.setSkillTag( entity.getSkillTag() );

        return questionResponse;
    }

    @Override
    public void updateEntityFromRequest(QuestionRequest request, Question entity) {
        if ( request == null ) {
            return;
        }

        entity.setType( request.getType() );
        entity.setContent( request.getContent() );
        if ( entity.getMetadata() != null ) {
            Map<String, Object> map = request.getMetadata();
            if ( map != null ) {
                entity.getMetadata().clear();
                entity.getMetadata().putAll( map );
            }
            else {
                entity.setMetadata( null );
            }
        }
        else {
            Map<String, Object> map = request.getMetadata();
            if ( map != null ) {
                entity.setMetadata( new LinkedHashMap<String, Object>( map ) );
            }
        }
        entity.setWeight( request.getWeight() );
        entity.setSkillTag( request.getSkillTag() );
    }

    private Long entityPoolId(Question question) {
        if ( question == null ) {
            return null;
        }
        QuestionPool pool = question.getPool();
        if ( pool == null ) {
            return null;
        }
        Long id = pool.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
