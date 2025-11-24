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
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Microsoft)"
)
@Component
public class ExamConfigMapperImpl implements ExamConfigMapper {

    @Override
    public ExamConfig toEntity(ExamConfigRequest request) {
        if ( request == null ) {
            return null;
        }

        ExamConfig.ExamConfigBuilder examConfig = ExamConfig.builder();

        examConfig.title( request.getTitle() );
        examConfig.courseId( request.getCourseId() );
        examConfig.lessonId( request.getLessonId() );
        examConfig.policy( request.getPolicy() );
        examConfig.browserLockEnabled( request.getBrowserLockEnabled() );
        examConfig.timeLimitMinutes( request.getTimeLimitMinutes() );
        examConfig.windowStart( request.getWindowStart() );
        examConfig.windowEnd( request.getWindowEnd() );
        Map<String, Object> map = request.getPolicyConfig();
        if ( map != null ) {
            examConfig.policyConfig( new LinkedHashMap<String, Object>( map ) );
        }

        return examConfig.build();
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
