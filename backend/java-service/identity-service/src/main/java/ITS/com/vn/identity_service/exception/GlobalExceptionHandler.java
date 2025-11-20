package ITS.com.vn.identity_service.exception;

import ITS.com.vn.identity_service.dto.apiResponse.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = AppException.class)
     ResponseEntity<ApiResponse> handlingAppException(AppException exception) {
        StatusCode errorCode = exception.getStatusCode();
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setStatusCode(errorCode.getStatusCode().value());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

}
