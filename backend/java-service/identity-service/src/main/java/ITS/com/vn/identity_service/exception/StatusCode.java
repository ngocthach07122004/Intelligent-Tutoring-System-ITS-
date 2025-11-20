package ITS.com.vn.identity_service.exception;

import lombok.Data;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum StatusCode {
    USER_EXISTED(HttpStatus.BAD_REQUEST, "User existed" ),
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "User not found"),
    CREATE_USER_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "Create user fail" ),
    KEYCLOAK_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Keycloak error"),
    UNAUTHENTICATED(HttpStatus.UNAUTHORIZED,"Unauthenticated"),
    SESSION_NOT_VALID(HttpStatus.UNAUTHORIZED, "Session not valid"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Keycloak handle error")
    ;

    StatusCode( HttpStatusCode statusCode, String message ) {
        this.statusCode = statusCode;
        this.message = message;
    }
    private final HttpStatusCode statusCode;
    private final String message;

}
