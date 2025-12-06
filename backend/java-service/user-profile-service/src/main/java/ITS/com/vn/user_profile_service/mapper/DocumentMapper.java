package ITS.com.vn.user_profile_service.mapper;

import ITS.com.vn.user_profile_service.domain.entity.Document;
import ITS.com.vn.user_profile_service.dto.document.DocumentRequest;
import ITS.com.vn.user_profile_service.dto.document.DocumentResponse;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface DocumentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "favorite", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Document toEntity(DocumentRequest request);

    DocumentResponse toResponse(Document entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "favorite", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(DocumentRequest request, @MappingTarget Document entity);
}
