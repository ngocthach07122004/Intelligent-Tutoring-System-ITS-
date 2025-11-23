package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.entity.ExamConfig;
import ITS.com.vn.assessment_service.domain.entity.ExamSectionRule;
import ITS.com.vn.assessment_service.dto.request.ExamConfigRequest;
import ITS.com.vn.assessment_service.dto.request.ExamSectionRuleRequest;
import ITS.com.vn.assessment_service.dto.response.ExamConfigResponse;
import ITS.com.vn.assessment_service.dto.response.ExamSectionRuleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ExamConfigMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instructorId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "attempts", ignore = true)
    @Mapping(target = "sections", ignore = true)
    ExamConfig toEntity(ExamConfigRequest request);

    ExamConfigResponse toResponse(ExamConfig entity);

    @Mapping(target = "sections", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instructorId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "attempts", ignore = true)
    void updateEntityFromRequest(ExamConfigRequest request, @MappingTarget ExamConfig entity);

    @Mapping(target = "pool", ignore = true)
    @Mapping(target = "examConfig", ignore = true)
    @Mapping(target = "id", ignore = true)
    ExamSectionRule toSectionEntity(ExamSectionRuleRequest request);

    @Mapping(source = "pool.id", target = "poolId")
    @Mapping(source = "pool.name", target = "poolName")
    ExamSectionRuleResponse toSectionResponse(ExamSectionRule entity);
}
