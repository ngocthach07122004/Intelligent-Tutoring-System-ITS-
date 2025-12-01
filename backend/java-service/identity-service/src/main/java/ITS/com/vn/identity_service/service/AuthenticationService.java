package ITS.com.vn.identity_service.service;

import ITS.com.vn.identity_service.dto.AuthenticationResponse;
import ITS.com.vn.identity_service.dto.LoginRequest;
import ITS.com.vn.identity_service.dto.RegisterRequest;
import ITS.com.vn.identity_service.dto.UserResponse;
import ITS.com.vn.identity_service.model.Role;
import ITS.com.vn.identity_service.model.User;
import ITS.com.vn.identity_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EventPublisherService eventPublisherService;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());

        // Validate username and email uniqueness
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Set default role if not provided
        Set<Role> roles = request.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = new HashSet<>();
            roles.add(Role.STUDENT);
        }

        // Create user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {} with roles: {}", savedUser.getUsername(), savedUser.getRoles());

        // Publish event if user is a student
        if (savedUser.getRoles().contains(Role.STUDENT)) {
            eventPublisherService.publishUserCreated(savedUser);
        }

        // Generate tokens
        Set<String> roleStrings = savedUser.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());

        String accessToken = jwtService.generateAccessToken(
                savedUser.getId(),
                savedUser.getUsername(),
                roleStrings);

        String refreshToken = jwtService.generateRefreshToken(
                savedUser.getId(),
                savedUser.getUsername(),
                roleStrings);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        log.info("User login attempt: {}", request.getUsername());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        if (!user.getEnabled()) {
            throw new IllegalStateException("User account is disabled");
        }

        Set<String> roleStrings = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());

        String accessToken = jwtService.generateAccessToken(
                user.getId(),
                user.getUsername(),
                roleStrings);

        String refreshToken = jwtService.generateRefreshToken(
                user.getId(),
                user.getUsername(),
                roleStrings);

        log.info("User logged in successfully: {}", user.getUsername());

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .build();
    }

    public AuthenticationResponse refreshToken(String refreshToken) {
        if (!jwtService.isTokenValid(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        UUID userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        Set<String> roleStrings = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());

        String newAccessToken = jwtService.generateAccessToken(
                user.getId(),
                user.getUsername(),
                roleStrings);

        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .build();
    }

    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .enabled(user.getEnabled())
                .build();
    }
}
