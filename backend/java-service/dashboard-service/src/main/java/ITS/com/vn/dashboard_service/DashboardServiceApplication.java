package ITS.com.vn.dashboard_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DashboardServiceApplication {

	public static void main(String[] args) {

        SpringApplication application = new SpringApplication(DashboardServiceApplication.class);
        application.run(args);
	}

}
