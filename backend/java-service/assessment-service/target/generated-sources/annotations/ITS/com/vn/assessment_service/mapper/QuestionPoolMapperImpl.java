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

        QuestionPool questionPool = new QuestionPool();

        questionPool.setName( request.getName() );
        questionPool.setDifficulty( request.getDifficulty() );
        questionPool.setIsPublic( request.getIsPublic() );

        return questionPool;
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
