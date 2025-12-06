package ITS.com.vn.user_profile_service.dto.student;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubjectGrade {
    private String name;
    private String code;
    private int credits;
    private String grade;
    private double score;
    private String teacher;
}
