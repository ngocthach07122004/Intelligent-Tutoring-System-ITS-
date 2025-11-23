package ITS.com.vn.assessment_service.mapper;

import ITS.com.vn.assessment_service.domain.entity.ExamConfig;
import ITS.com.vn.assessment_service.domain.entity.ExamSectionRule;
import ITS.com.vn.assessment_service.domain.entity.QuestionPool;
import ITS.com.vn.assessment_service.dto.request.ExamConfigRequest;
import ITS.com.vn.assessment_service.dto.request.ExamSectionRuleRequest;
import ITS.com.vn.assessment_service.dto.response.ExamConfigResponse;
import ITS.com.vn.assessment_service.dto.response.ExamSectionRuleResponse;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class ExamConfigMapperImpl implements ExamConfigMapper {

    @Override
    public ExamConfig toEntity(ExamConfigRequest request) {
        if ( request == null ) {
            return null;
        }

        ExamConfig examConfig = new ExamConfig();

        examConfig.setTitle( request.getTitle() );
        examConfig.setCourseId( request.getCourseId() );
        examConfig.setLessonId( request.getLessonId() );
        examConfig.setPolicy( request.getPolicy() );
        examConfig.setBrowserLockEnabled( request.getBrowserLockEnabled() );
        examConfig.setTimeLimitMinutes( request.getTimeLimitMinutes() );
        examConfig.setWindowStart( request.getWindowStart() );
        examConfig.setWindowEnd( request.getWindowEnd() );
        Map<String, Object> map = request.getPolicyConfig();
        if ( map != null ) {
            examConfig.setPolicyConfig( new LinkedHashMap<String, Object>( map ) );
        }

        return examConfig;
    }

    @Override
    public ExamConfigResponse toResponse(ExamConfig entity) {
        if ( entity == null ) {
            return null;
        }

        ExamConfigResponse examConfigResponse = new ExamConfigResponse();

        examConfigResponse.setId( entity.getId() );
        examConfigResponse.setTitle( entity.getTitle() );
        examConfigResponse.setCourseId( entity.getCourseId() );
        examConfigResponse.setLessonId( entity.getLessonId() );
        examConfigResponse.setPolicy( entity.getPolicy() );
        examConfigResponse.setBrowserLockEnabled( entity.getBrowserLockEnabled() );
        examConfigResponse.setTimeLimitMinutes( entity.getTimeLimitMinutes() );
        examConfigResponse.setWindowStart( entity.getWindowStart() );
        examConfigResponse.setWindowEnd( entity.getWindowEnd() );
        Map<String, Object> map = entity.getPolicyConfig();
        if ( map != null ) {
            examConfigResponse.setPolicyConfig( new LinkedHashMap<String, Object>( map ) );
        }
        examConfigResponse.setInstructorId( entity.getInstructorId() );
        examConfigResponse.setCreatedAt( entity.getCreatedAt() );
        examConfigResponse.setSections( examSectionRuleListToExamSectionRuleResponseList( entity.getSections() ) );

        return examConfigResponse;
    }

    @Override
    public void updateEntityFromRequest(ExamConfigRequest request, ExamConfig entity) {
        if ( request == null ) {
            return;
        }

        entity.setTitle( request.getTitle() );
        entity.setCourseId( request.getCourseId() );
        entity.setLessonId( request.getLessonId() );
        entity.setPolicy( request.getPolicy() );
        entity.setBrowserLockEnabled( request.getBrowserLockEnabled() );
        entity.setTimeLimitMinutes( request.getTimeLimitMinutes() );
        entity.setWindowStart( request.getWindowStart() );
        entity.setWindowEnd( request.getWindowEnd() );
        if ( entity.getPolicyConfig() != null ) {
            Map<String, Object> map = request.getPolicyConfig();
            if ( map != null ) {
                entity.getPolicyConfig().clear();
                entity.getPolicyConfig().putAll( map );
            }
            else {
                entity.setPolicyConfig( null );
            }
        }
        else {
            Map<String, Object> map = request.getPolicyConfig();
            if ( map != null ) {
                entity.setPolicyConfig( new LinkedHashMap<String, Object>( map ) );
            }
        }
    }

    @Override
    public ExamSectionRule toSectionEntity(ExamSectionRuleRequest request) {
        if ( request == null ) {
            return null;
        }

        ExamSectionRule examSectionRule = new ExamSectionRule();

        examSectionRule.setCountToPull( request.getCountToPull() );
        examSectionRule.setPointsPerQuestion( request.getPointsPerQuestion() );

        return examSectionRule;
    }

    @Override
    public ExamSectionRuleResponse toSectionResponse(ExamSectionRule entity) {
        if ( entity == null ) {
            return null;
        }

        ExamSectionRuleResponse examSectionRuleResponse = new ExamSectionRuleResponse();

        examSectionRuleResponse.setPoolId( entityPoolId( entity ) );
        examSectionRuleResponse.setPoolName( entityPoolName( entity ) );
        examSectionRuleResponse.setId( entity.getId() );
        examSectionRuleResponse.setCountToPull( entity.getCountToPull() );
        examSectionRuleResponse.setPointsPerQuestion( entity.getPointsPerQuestion() );

        return examSectionRuleResponse;
    }

    protected List<ExamSectionRuleResponse> examSectionRuleListToExamSectionRuleResponseList(List<ExamSectionRule> list) {
        if ( list == null ) {
            return null;
        }

        List<ExamSectionRuleResponse> list1 = new ArrayList<ExamSectionRuleResponse>( list.size() );
        for ( ExamSectionRule examSectionRule : list ) {
            list1.add( toSectionResponse( examSectionRule ) );
        }

        return list1;
    }

    private Long entityPoolId(ExamSectionRule examSectionRule) {
        if ( examSectionRule == null ) {
            return null;
        }
        QuestionPool pool = examSectionRule.getPool();
        if ( pool == null ) {
            return null;
        }
        Long id = pool.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String entityPoolName(ExamSectionRule examSectionRule) {
        if ( examSectionRule == null ) {
            return null;
        }
        QuestionPool pool = examSectionRule.getPool();
        if ( pool == null ) {
            return null;
        }
        String name = pool.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
