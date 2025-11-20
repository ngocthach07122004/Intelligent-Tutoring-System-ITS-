package ITS.com.vn.api_gateway.config;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
@Configuration
public class EurekaClientConfig {

//    @Bean
//    public RestTemplateBuilder restTemplateBuilder() {
//        return new RestTemplateBuilder();
//    }
//
//    @Bean
//    public RestTemplate eurekaRestTemplate(RestTemplateBuilder builder) {
//        return builder
//                .basicAuthentication("eureka", "12345678")
//                .build();
//    }
}
