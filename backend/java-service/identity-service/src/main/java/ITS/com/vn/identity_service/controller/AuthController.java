package ITS.com.vn.identity_service.controller;

import ITS.com.vn.identity_service.dto.apiResponse.ApiResponse;
import ITS.com.vn.identity_service.dto.request.LoginRequest;
import ITS.com.vn.identity_service.dto.request.RefreshTokenRequest;
import ITS.com.vn.identity_service.dto.request.RegisterRequest;
import ITS.com.vn.identity_service.dto.request.ResetPasswordRequest;
import ITS.com.vn.identity_service.dto.response.TokenResponse;
import ITS.com.vn.identity_service.model.TokenSession;
import ITS.com.vn.identity_service.service.authService.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ApiResponse<TokenResponse> register(@RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/refresh")
    public  ApiResponse<TokenResponse> refresh(@RequestBody RefreshTokenRequest req) {
      return authService.refreshToken(req.getRefreshToken());
    }

    @PostMapping("/logout")
    public ApiResponse<?> logout(@RequestBody RefreshTokenRequest req) {
        authService.logout(req.getRefreshToken());
        return ApiResponse.builder().statusCode(200).message("success").build();
    }

    @GetMapping("/sessions/{username}")
    public ApiResponse<List<TokenSession> >listSessions(@PathVariable String username) {
        return ApiResponse.<List<TokenSession>>builder().statusCode(200).message("success").body(authService.listSessions(username)).build();
    }

    @DeleteMapping("/sessions/{id}")
    public ApiResponse<?> revoke(@PathVariable Long id) {
        authService.revokeSession(id);
        return ApiResponse.builder().statusCode(200).message("success").build();
    }

    @PostMapping("/reset-password")
    public ApiResponse<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ApiResponse.builder().statusCode(200).message("success").build();
    }
}
