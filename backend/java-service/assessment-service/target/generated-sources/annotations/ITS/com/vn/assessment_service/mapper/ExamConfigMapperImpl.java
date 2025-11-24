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

        ExamConfig.ExamConfigBuilder examConfig = ExamConfig.builder();

        examConfig.browserLockEnabled( request.getBrowserLockEnabled() );
        examConfig.courseId( request.getCourseId() );
        examConfig.lessonId( request.getLessonId() );
        examConfig.policy( request.getPolicy() );
        Map<String, Object> map = request.getPolicyConfig();
        if ( map != null ) {
            examConfig.policyConfig( new LinkedHashMap<String, Object>( map ) );
        }
        examConfig.timeLimitMinutes( request.getTimeLimitMinutes() );
        examConfig.title( request.getTitle() );
        examConfig.windowEnd( request.getWindowEnd() );
        examConfig.windowStart( request.getWindowStart() );

        return examConfig.build();
    }

    @Override
    public ExamConfigResponse toResponse(ExamConfig entity) {
        if ( entity == null ) {
            return null;
        }

        ExamConfigResponse examConfigResponse = new ExamConfigResponse();

        examConfigResponse.setBrowserLockEnabled( entity.getBrowserLockEnabled() );
        examConfigResponse.setCourseId( entity.getCourseId() );
        examConfigResponse.setCreatedAt( entity.getCreatedAt() );
        examConfigResponse.setId( entity.getId() );
        examConfigResponse.setInstructorId( entity.getInstructorId() );
        examConfigResponse.setLessonId( entity.getLessonId() );
        examConfigResponse.setPolicy( entity.getPolicy() );
        Map<String, Object> map = entity.getPolicyConfig();
        if ( map != null ) {
            examConfigResponse.setPolicyConfig( new LinkedHashMap<String, Object>( map ) );
        }
        examConfigResponse.setSections( examSectionRuleListToExamSectionRuleResponseList( entity.getSections() ) );
        examConfigResponse.setTimeLimitMinutes( entity.getTimeLimitMinutes() );
        examConfigResponse.setTitle( entity.getTitle() );
        examConfigResponse.setWindowEnd( entity.getWindowEnd() );
        examConfigResponse.setWindowStart( entity.getWindowStart() );

        return examConfigResponse;
    }

    @Override
    public void updateEntityFromRequest(ExamConfigRequest request, ExamConfig entity) {
        if ( request == null ) {
            return;
        }

        entity.setBrowserLockEnabled( request.getBrowserLockEnabled() );
        entity.setCourseId( request.getCourseId() );
        entity.setLessonId( request.getLessonId() );
        entity.setPolicy( request.getPolicy() );
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
        entity.setTimeLimitMinutes( request.getTimeLimitMinutes() );
        entity.setTitle( request.getTitle() );
        entity.setWindowEnd( request.getWindowEnd() );
        entity.setWindowStart( request.getWindowStart() );
    }

    @Override
    public ExamSectionRule toSectionEntity(ExamSectionRuleRequest request) {
        if ( request == null ) {
            return null;
        }

        ExamSectionRule.ExamSectionRuleBuilder examSectionRule = ExamSectionRule.builder();

        examSectionRule.countToPull( request.getCountToPull() );
        examSectionRule.pointsPerQuestion( request.getPointsPerQuestion() );

        return examSectionRule.build();
    }

    @Override
    public ExamSectionRuleResponse toSectionResponse(ExamSectionRule entity) {
        if ( entity == null ) {
            return null;
        }

        ExamSectionRuleResponse examSectionRuleResponse = new ExamSectionRuleResponse();

        examSectionRuleResponse.setPoolId( entityPoolId( entity ) );
        examSectionRuleResponse.setPoolName( entityPoolName( entity ) );
        examSectionRuleResponse.setCountToPull( entity.getCountToPull() );
        examSectionRuleResponse.setId( entity.getId() );
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
