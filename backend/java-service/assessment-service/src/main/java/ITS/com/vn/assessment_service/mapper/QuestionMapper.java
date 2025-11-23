package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.entity.Question;
import ITS.com.vn.assessment_service.dto.request.QuestionRequest;
import ITS.com.vn.assessment_service.dto.response.QuestionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    @Mapping(target = "pool", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rubrics", ignore = true)
    @Mapping(target = "answers", ignore = true)
    Question toEntity(QuestionRequest request);

    @Mapping(source = "pool.id", target = "poolId")
    QuestionResponse toResponse(Question entity);

    @Mapping(target = "pool", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rubrics", ignore = true)
    @Mapping(target = "answers", ignore = true)
    void updateEntityFromRequest(QuestionRequest request, @MappingTarget Question entity);
}
