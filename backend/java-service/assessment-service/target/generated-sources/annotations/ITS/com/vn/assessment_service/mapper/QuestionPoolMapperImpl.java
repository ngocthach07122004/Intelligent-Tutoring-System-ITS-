package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.entity.QuestionPool;
import ITS.com.vn.assessment_service.dto.request.QuestionPoolRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionPoolResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class QuestionPoolMapperImpl implements QuestionPoolMapper {

    @Override
    public QuestionPool toEntity(QuestionPoolRequest request) {
        if ( request == null ) {
            return null;
        }

        QuestionPool.QuestionPoolBuilder questionPool = QuestionPool.builder();

        questionPool.difficulty( request.getDifficulty() );
        questionPool.isPublic( request.getIsPublic() );
        questionPool.name( request.getName() );

        return questionPool.build();
    }

    @Override
    public QuestionPoolResponse toResponse(QuestionPool entity) {
        if ( entity == null ) {
            return null;
        }

        QuestionPoolResponse questionPoolResponse = new QuestionPoolResponse();

        questionPoolResponse.setCreatedAt( entity.getCreatedAt() );
        questionPoolResponse.setDifficulty( entity.getDifficulty() );
        questionPoolResponse.setId( entity.getId() );
        questionPoolResponse.setInstructorId( entity.getInstructorId() );
        questionPoolResponse.setIsPublic( entity.getIsPublic() );
        questionPoolResponse.setName( entity.getName() );

        return questionPoolResponse;
    }

    @Override
    public void updateEntityFromRequest(QuestionPoolRequest request, QuestionPool entity) {
        if ( request == null ) {
            return;
        }

        entity.setDifficulty( request.getDifficulty() );
        entity.setIsPublic( request.getIsPublic() );
        entity.setName( request.getName() );
    }
}
