package ITS.com.vn.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable) // Gateway không cần CSRF
                // CORS được cấu hình trong application.yml
                .authorizeExchange(exchanges -> exchanges
                        .anyExchange().permitAll() 
                );

        return http.build();
    }
}