package ITS.com.vn.identity_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.Instant;

@Data
@Builder
public class ErrorResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private Instant timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}