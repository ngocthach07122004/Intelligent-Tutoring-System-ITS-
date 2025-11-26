//package ITS.com.vn.identity_service.service.authService;
//
//import ITS.com.vn.identity_service.dto.apiResponse.ApiResponse;
//import ITS.com.vn.identity_service.dto.request.LoginRequest;
//import ITS.com.vn.identity_service.dto.request.RegisterRequest;
//import ITS.com.vn.identity_service.dto.request.ResetPasswordRequest;
//import ITS.com.vn.identity_service.dto.response.KeycloakTokenResponse;
//import ITS.com.vn.identity_service.dto.response.TokenResponse;
//import ITS.com.vn.identity_service.exception.AppException;
//import ITS.com.vn.identity_service.exception.StatusCode;
//import ITS.com.vn.identity_service.model.TokenSession;
//import ITS.com.vn.identity_service.model.User;
//import ITS.com.vn.identity_service.repository.TokenSessionRepository;
//import ITS.com.vn.identity_service.repository.UserRepository;
//import ITS.com.vn.identity_service.service.keycloakService.KeycloakAdminService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.MediaType;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.reactive.function.BodyInserters;
//import org.springframework.web.reactive.function.client.WebClient;
//
//import java.time.Instant;
//import java.util.List;
//
//@Service
//public class AuthService {
//
//    @Value("${keycloak.server-url}")
//    private String authServerUrl;
//
//    @Value("${keycloak.realm}")
//    private String realm;
//
//    @Value("${keycloak.client-id}")
//    private String clientId;
//
//    @Value("${keycloak.client-secret}")
//    private String clientSecret;
//
//    @Autowired
//    private TokenSessionRepository tokenSessionRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private KeycloakAdminService keycloakAdminService;
//    @Autowired
//    private  PasswordEncoder passwordEncoder;
//    private final WebClient webClient = WebClient.create();
//
//    /**
//     * Đăng ký người dùng
//     */
//    public ApiResponse<TokenResponse> register(RegisterRequest registerRequest ) {
//        if (userRepository.findByGmail(registerRequest.getEmail()).isPresent()) {
//             throw new AppException(StatusCode.USER_EXISTED);
//        }
//        String username = resolveUsername(registerRequest);
//        String keycloakId = keycloakAdminService.createUser(username, registerRequest.getEmail(), registerRequest.getPassword());
//        User user = new User();
//        user.setGmail(registerRequest.getEmail());
//        user.setUserName(username);
//        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
//        user.setKeycloakId(keycloakId);
//        userRepository.save(user);
//        KeycloakTokenResponse kcResponse = keyCloakAuthenticate(registerRequest.getEmail(), registerRequest.getPassword());
//        TokenSession session = buildSession(username, kcResponse);
//        tokenSessionRepository.save(session);
//        return ApiResponse.<TokenResponse>builder()
//                .statusCode(200)
//                .message("success")
//                .body(buildTokenResponse(user, kcResponse))
//                .build();
//    }
//    private KeycloakTokenResponse keyCloakAuthenticate (String username, String password) {
//        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
//        try {
//            KeycloakTokenResponse kcResponse = webClient.post()
//                    .uri(tokenUrl)
//                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
//                    .body(BodyInserters.fromFormData("grant_type", "password")
//                            .with("client_id", clientId)
//                            .with("client_secret", clientSecret)
//                            .with("username", username)
//                            .with("password", password))
//                    .retrieve()
//                    .bodyToMono(KeycloakTokenResponse.class)
//                    .block();
//            if (kcResponse == null) throw new AppException(StatusCode.INTERNAL_SERVER_ERROR);
//            return kcResponse;
//        }
//        catch ( Exception exception ) {
//            throw new AppException(StatusCode.UNAUTHENTICATED);
//        }
//
//
//    }
//    /**
//     * Đăng nhập
//     */
//    public ApiResponse<TokenResponse> login(LoginRequest loginRequest) {
//        String principal = loginRequest.getEmail();
////        String principal = loginRequest.getUsername() != null ? loginRequest.getUsername() : loginRequest.getEmail();
////        if (principal == null || principal.isBlank()) {
////            throw new AppException(StatusCode.UNAUTHENTICATED);
////        }
//        KeycloakTokenResponse kcResponse = keyCloakAuthenticate(principal, loginRequest.getPassword());
//        TokenSession session = buildSession(principal, kcResponse);
//        tokenSessionRepository.save(session);
//        User user = userRepository.findByGmail(principal)
//                .orElseGet(() -> userRepository.findByUserName(principal).orElse(null));
//        return ApiResponse.<TokenResponse>builder()
//                .statusCode(200)
//                .message("success")
//                .body(buildTokenResponse(user, kcResponse))
//                .build();
//    }
//
//    /**
//     * Làm mới token
//     */
//    public  ApiResponse<TokenResponse>  refreshToken(String refreshToken) {
//        TokenSession session = tokenSessionRepository.findByRefreshToken(refreshToken)
//                .orElseThrow(() -> new AppException(StatusCode.SESSION_NOT_VALID));
//
//        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
//
//        KeycloakTokenResponse kcResponse = webClient.post()
//                .uri(tokenUrl)
//                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
//                .body(BodyInserters.fromFormData("grant_type", "refresh_token")
//                        .with("client_id", clientId)
//                        .with("client_secret", clientSecret)
//                        .with("refresh_token", refreshToken))
//                .retrieve()
//                .bodyToMono(KeycloakTokenResponse.class)
//                .block();
//
//        if (kcResponse == null) throw new AppException(StatusCode.KEYCLOAK_ERROR);
//
//        session.setAccessToken(kcResponse.getAccessToken());
//        session.setRefreshToken(kcResponse.getRefreshToken());
//        session.setAccessTokenExpiry(Instant.now().plusSeconds(kcResponse.getExpiresIn()));
//        session.setRefreshTokenExpiry(Instant.now().plusSeconds(kcResponse.getRefreshExpiresIn()));
//        tokenSessionRepository.save(session);
//
//        User user = userRepository.findByUserName(session.getUsername()).orElse(null);
//
//        return ApiResponse.<TokenResponse>builder()
//                .statusCode(200)
//                .message("success")
//                .body(buildTokenResponse(user, kcResponse))
//                .build();
//    }
//
//    /**
//     * Đăng xuất
//     */
//    @Transactional
//    public void logout(String refreshToken) {
//        if (refreshToken == null || refreshToken.isBlank()) {
//            return;
//        }
//        tokenSessionRepository.deleteByRefreshToken(refreshToken);
//    }
//
//    /**
//     * Danh sách session của user
//     */
//    public List<TokenSession> listSessions(String username) {
//        return tokenSessionRepository.findByUsername(username);
//    }
//
//    /**
//     * Thu hồi 1 session cụ thể
//     */
//    public void revokeSession(Long sessionId) {
//        tokenSessionRepository.deleteById(sessionId);
//    }
//
//    /**
//     * Reset mật khẩu (cấp token mới)
//     */
//    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
//        User user = userRepository.findByGmail(resetPasswordRequest.getEmail())
//                .orElseThrow(() -> new AppException(StatusCode.USER_NOT_FOUND));
//        KeycloakTokenResponse kcResponse = keyCloakAuthenticate(resetPasswordRequest.getEmail(),resetPasswordRequest.getOldPassword());
//        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));
//        userRepository.save(user);
//        keycloakAdminService.resetUserPassword(user.getKeycloakId(), resetPasswordRequest.getNewPassword());
//    }
//
//    private TokenSession buildSession(String username, KeycloakTokenResponse kcResponse) {
//        TokenSession session = new TokenSession();
//        session.setUsername(username);
//        session.setAccessToken(kcResponse.getAccessToken());
//        session.setRefreshToken(kcResponse.getRefreshToken());
//        session.setAccessTokenExpiry(Instant.now().plusSeconds(kcResponse.getExpiresIn()));
//        session.setRefreshTokenExpiry(Instant.now().plusSeconds(kcResponse.getRefreshExpiresIn()));
//        session.setClientId(clientId);
//        return session;
//    }
//
//    private TokenResponse buildTokenResponse(User user, KeycloakTokenResponse kcResponse) {
//        String role = "student"; // default role for FE navigation; adjust when roles available
//        return TokenResponse.builder()
//                .accessToken(kcResponse.getAccessToken())
//                .refreshToken(kcResponse.getRefreshToken())
//                .expiresIn(kcResponse.getExpiresIn())
//                .refreshExpiresIn(kcResponse.getRefreshExpiresIn())
//                .tokenType("Bearer")
//                .userId(user != null ? user.getId() : null)
//                .email(user != null ? user.getGmail() : null)
//                .name(user != null ? user.getUserName() : null)
//                .role(role)
//                .build();
//    }
//
//    private String resolveUsername(RegisterRequest registerRequest) {
//        if (registerRequest.getUsername() != null && !registerRequest.getUsername().isBlank()) {
//            return registerRequest.getUsername();
//        }
//        if (registerRequest.getName() != null && !registerRequest.getName().isBlank()) {
//            return registerRequest.getName();
//        }
//        return registerRequest.getEmail();
//    }
//}


package ITS.com.vn.identity_service.service.authService;

import ITS.com.vn.identity_service.dto.apiResponse.ApiResponse;
import ITS.com.vn.identity_service.dto.request.LoginRequest;
import ITS.com.vn.identity_service.dto.request.RegisterRequest;
import ITS.com.vn.identity_service.dto.request.ResetPasswordRequest;
import ITS.com.vn.identity_service.dto.response.KeycloakTokenResponse;
import ITS.com.vn.identity_service.dto.response.TokenResponse;
import ITS.com.vn.identity_service.exception.AppException;
import ITS.com.vn.identity_service.exception.StatusCode;
import ITS.com.vn.identity_service.model.TokenSession;
import ITS.com.vn.identity_service.model.User;
import ITS.com.vn.identity_service.repository.TokenSessionRepository;
import ITS.com.vn.identity_service.repository.UserRepository;
import ITS.com.vn.identity_service.service.keycloakService.KeycloakAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.List;

@Service
public class AuthService {

    @Value("${keycloak.server-url}")
    private String authServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Autowired
    private TokenSessionRepository tokenSessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KeycloakAdminService keycloakAdminService;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    private final WebClient webClient = WebClient.create();

    /**
     * Đăng ký người dùng
     */
    public ApiResponse<TokenResponse> register(RegisterRequest registerRequest ) {
        if (userRepository.findByGmail(registerRequest.getEmail()).isPresent()) {
            throw new AppException(StatusCode.USER_EXISTED);
        }
        String keycloakId = keycloakAdminService.createUser(registerRequest.getUsername(), registerRequest.getEmail(), registerRequest.getPassword());
        User user = new User();
        user.setGmail(registerRequest.getEmail());
        user.setUserName(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setKeycloakId(keycloakId);
        userRepository.save(user);
        KeycloakTokenResponse kcResponse = keyCloakAuthenticate(registerRequest.getUsername(),registerRequest.getPassword());
        TokenSession session = new TokenSession();
        session.setUsername(registerRequest.getUsername());
        session.setAccessToken(kcResponse.getAccessToken());
        session.setRefreshToken(kcResponse.getRefreshToken());
        session.setAccessTokenExpiry(Instant.now().plusSeconds(kcResponse.getExpiresIn()));
        session.setRefreshTokenExpiry(Instant.now().plusSeconds(kcResponse.getRefreshExpiresIn()));
        session.setClientId(clientId);
        tokenSessionRepository.save(session);
        return ApiResponse.<TokenResponse>builder().statusCode(200).message("success").body(new TokenResponse(kcResponse.getAccessToken(), kcResponse.getRefreshToken(), kcResponse.getExpiresIn())).build();
    }
    private KeycloakTokenResponse keyCloakAuthenticate (String username, String password) {
        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
        try {
            KeycloakTokenResponse kcResponse = webClient.post()
                    .uri(tokenUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData("grant_type", "password")
                            .with("client_id", clientId)
                            .with("client_secret", clientSecret)
                            .with("username", username)
                            .with("password", password))
                    .retrieve()
                    .bodyToMono(KeycloakTokenResponse.class)
                    .block();
            if (kcResponse == null) throw new AppException(StatusCode.INTERNAL_SERVER_ERROR);
            return kcResponse;
        }
        catch ( Exception exception ) {
            throw new AppException(StatusCode.UNAUTHENTICATED);
        }


    }
    /**
     * Đăng nhập
     */
    public ApiResponse<TokenResponse> login(LoginRequest loginRequest) {

        KeycloakTokenResponse kcResponse = keyCloakAuthenticate(loginRequest.getUsername(),loginRequest.getPassword());
        TokenSession session = new TokenSession();
        session.setUsername(loginRequest.getUsername());
        session.setAccessToken(kcResponse.getAccessToken());
        session.setRefreshToken(kcResponse.getRefreshToken());
        session.setAccessTokenExpiry(Instant.now().plusSeconds(kcResponse.getExpiresIn()));
        session.setRefreshTokenExpiry(Instant.now().plusSeconds(kcResponse.getRefreshExpiresIn()));
        session.setClientId(clientId);
        tokenSessionRepository.save(session);
        return ApiResponse.<TokenResponse>builder().statusCode(200).message("success").body(new TokenResponse(kcResponse.getAccessToken(), kcResponse.getRefreshToken(), kcResponse.getExpiresIn())).build();
    }

    /**
     * Làm mới token
     */
    public  ApiResponse<TokenResponse>  refreshToken(String refreshToken) {
        TokenSession session = tokenSessionRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new AppException(StatusCode.SESSION_NOT_VALID));

        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        KeycloakTokenResponse kcResponse = webClient.post()
                .uri(tokenUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "refresh_token")
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret)
                        .with("refresh_token", refreshToken))
                .retrieve()
                .bodyToMono(KeycloakTokenResponse.class)
                .block();

        if (kcResponse == null) throw new AppException(StatusCode.KEYCLOAK_ERROR);

        session.setAccessToken(kcResponse.getAccessToken());
        session.setRefreshToken(kcResponse.getRefreshToken());
        session.setAccessTokenExpiry(Instant.now().plusSeconds(kcResponse.getExpiresIn()));
        session.setRefreshTokenExpiry(Instant.now().plusSeconds(kcResponse.getRefreshExpiresIn()));
        tokenSessionRepository.save(session);

        return ApiResponse.<TokenResponse>builder().statusCode(200).message("success").body(new TokenResponse(kcResponse.getAccessToken(), kcResponse.getRefreshToken(), kcResponse.getExpiresIn())).build();
    }

    /**
     * Đăng xuất
     */
    @Transactional
    public void logout(String refreshToken) {
        tokenSessionRepository.deleteByRefreshToken(refreshToken);
    }

    /**
     * Danh sách session của user
     */
    public List<TokenSession> listSessions(String username) {
        return tokenSessionRepository.findByUsername(username);
    }

    /**
     * Thu hồi 1 session cụ thể
     */
    public void revokeSession(Long sessionId) {
        tokenSessionRepository.deleteById(sessionId);
    }

    /**
     * Reset mật khẩu (cấp token mới)
     */
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        User user = userRepository.findByGmail(resetPasswordRequest.getEmail())
                .orElseThrow(() -> new AppException(StatusCode.USER_NOT_FOUND));
        KeycloakTokenResponse kcResponse = keyCloakAuthenticate(resetPasswordRequest.getEmail(),resetPasswordRequest.getOldPassword());
        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));
        userRepository.save(user);
        keycloakAdminService.resetUserPassword(user.getKeycloakId(), resetPasswordRequest.getNewPassword());
    }
}