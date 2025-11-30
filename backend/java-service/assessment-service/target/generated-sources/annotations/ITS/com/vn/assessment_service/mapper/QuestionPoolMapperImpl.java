package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.entity.QuestionPool;
import ITS.com.vn.assessment_service.dto.request.QuestionPoolRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionPoolResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class QuestionPoolMapperImpl implements QuestionPoolMapper {

    @Override
    public QuestionPool toEntity(QuestionPoolRequest request) {
        if ( request == null ) {
            return null;
        }

        QuestionPool.QuestionPoolBuilder questionPool = QuestionPool.builder();

        questionPool.name( request.getName() );
        questionPool.difficulty( request.getDifficulty() );
        questionPool.isPublic( request.getIsPublic() );

        return questionPool.build();
    }

    @Override
    public QuestionPoolResponse toResponse(QuestionPool entity) {
        if ( entity == null ) {
            return null;
        }

        QuestionPoolResponse questionPoolResponse = new QuestionPoolResponse();

        questionPoolResponse.setId( entity.getId() );
        questionPoolResponse.setName( entity.getName() );
        questionPoolResponse.setDifficulty( entity.getDifficulty() );
        questionPoolResponse.setIsPublic( entity.getIsPublic() );
        questionPoolResponse.setInstructorId( entity.getInstructorId() );
        questionPoolResponse.setCreatedAt( entity.getCreatedAt() );

        return questionPoolResponse;
    }

    @Override
    public void updateEntityFromRequest(QuestionPoolRequest request, QuestionPool entity) {
        if ( request == null ) {
            return;
        }

        entity.setName( request.getName() );
        entity.setDifficulty( request.getDifficulty() );
        entity.setIsPublic( request.getIsPublic() );
    }
}
