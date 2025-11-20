package ITS.com.vn.identity_service.dto.apiResponse;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Filter;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse <T> {
      int statusCode;
      String message;
      T body;

}
