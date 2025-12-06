package ITS.com.vn.identity_service.exception;

import lombok.AccessLevel;
import lombok.Builder;

import lombok.experimental.FieldDefaults;

@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppException extends RuntimeException {
    StatusCode statusCode;

    public AppException(StatusCode statusCode) {
        super(statusCode.getMessage());
        this.statusCode = statusCode;
    }

    public void setStatusCode(StatusCode statusCode) {
        this.statusCode = statusCode;
    }

    public StatusCode getStatusCode() {
        return this.statusCode;
    }
}
