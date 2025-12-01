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

        Question.QuestionBuilder question = Question.builder();

        question.content( request.getContent() );
        Map<String, Object> map = request.getMetadata();
        if ( map != null ) {
            question.metadata( new LinkedHashMap<String, Object>( map ) );
        }
        question.skillTag( request.getSkillTag() );
        question.type( request.getType() );
        question.weight( request.getWeight() );

        return question.build();
    }

    @Override
    public QuestionResponse toResponse(Question entity) {
        if ( entity == null ) {
            return null;
        }

        QuestionResponse questionResponse = new QuestionResponse();

        questionResponse.setPoolId( entityPoolId( entity ) );
        questionResponse.setContent( entity.getContent() );
        questionResponse.setId( entity.getId() );
        Map<String, Object> map = entity.getMetadata();
        if ( map != null ) {
            questionResponse.setMetadata( new LinkedHashMap<String, Object>( map ) );
        }
        questionResponse.setSkillTag( entity.getSkillTag() );
        questionResponse.setType( entity.getType() );
        questionResponse.setWeight( entity.getWeight() );

        return questionResponse;
    }

    @Override
    public void updateEntityFromRequest(QuestionRequest request, Question entity) {
        if ( request == null ) {
            return;
        }

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
        entity.setSkillTag( request.getSkillTag() );
        entity.setType( request.getType() );
        entity.setWeight( request.getWeight() );
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
