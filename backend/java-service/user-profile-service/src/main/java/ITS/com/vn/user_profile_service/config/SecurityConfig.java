package ITS.com.vn.user_profile_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.Map;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri:}")
    private String issuerUri;

    @Value("${app.security.mock.enabled:false}")
    private boolean mockAuthEnabled;

    @Value("${app.security.mock.user-id:00000000-0000-0000-0000-000000000001}")
    private String mockUserId;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        if (mockAuthEnabled) {
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            http.addFilterBefore(mockAuthenticationFilter(), AnonymousAuthenticationFilter.class);
        } else {
            http.authorizeHttpRequests(auth -> auth
                            .requestMatchers("/health", "/actuator/**").permitAll()
                            .requestMatchers("/api/v1/**").authenticated()
                            .anyRequest().authenticated())
                    .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())));
        }

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withIssuerLocation(issuerUri).build();
    }

    private OncePerRequestFilter mockAuthenticationFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    Jwt jwt = createMockJwt(request);
                    JwtAuthenticationToken authentication = new JwtAuthenticationToken(jwt, Collections.emptyList(), jwt.getSubject());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
                filterChain.doFilter(request, response);
            }
        };
    }

    private Jwt createMockJwt(HttpServletRequest request) {
        Instant now = Instant.now();
        String userId = resolveMockUserId(request);
        return new Jwt(
                "mock-token",
                now,
                now.plus(Duration.ofHours(1)),
                Map.of("alg", "none"),
                Map.of(
                        "sub", userId,
                        "preferred_username", "dev-user"
                )
        );
    }

    private String resolveMockUserId(HttpServletRequest request) {
        String headerUser = request.getHeader("X-User-Id");
        if (headerUser == null || headerUser.isBlank()) {
            headerUser = request.getHeader("X-Dev-User-Id");
        }
        return (headerUser != null && !headerUser.isBlank()) ? headerUser : mockUserId;
    }
}
