package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.entity.QuestionPool;
import ITS.com.vn.assessment_service.dto.request.QuestionPoolRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionPoolResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface QuestionPoolMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instructorId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "examSectionRules", ignore = true)
    QuestionPool toEntity(QuestionPoolRequest request);

    QuestionPoolResponse toResponse(QuestionPool entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instructorId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "examSectionRules", ignore = true)
    void updateEntityFromRequest(QuestionPoolRequest request, @MappingTarget QuestionPool entity);
}
