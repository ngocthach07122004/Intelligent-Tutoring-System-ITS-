// package ITS.com.vn.api_gateway.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.reactive.CorsWebFilter;
// import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

// @Configuration
// public class CorsConfig {

//     @Bean
//     public CorsWebFilter corsWebFilter() {
//         CorsConfiguration corsConfig = new CorsConfiguration();
//         // Allow local frontend; expand list if needed for staging/prod
// //        corsConfig.addAllowedOrigin("http://localhost:3000");
//         corsConfig.addAllowedOriginPattern("http://*.docker.internal:3000");
//         corsConfig.addAllowedOriginPattern("http://localhost:3000");
//         corsConfig.addAllowedOriginPattern("http://127.0.0.1:3000");

//         corsConfig.addAllowedHeader("*");
//         corsConfig.addAllowedMethod("*");
//         corsConfig.addExposedHeader("*");
//         corsConfig.setAllowCredentials(true);
//         corsConfig.setMaxAge(3600L); // Cache preflight response for 1 hour

//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", corsConfig);

//         return new CorsWebFilter(source);
//     }
// }
