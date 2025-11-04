package ITS.com.vn.identity_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseCreator implements ApplicationContextInitializer<ConfigurableApplicationContext> {



    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        Environment env = applicationContext.getEnvironment();

        String host = env.getProperty("custom.datasource.host");
        String port = env.getProperty("custom.datasource.port");
        String dbName = env.getProperty("custom.datasource.dbName");
        String user = env.getProperty("custom.datasource.user");
        String pass = env.getProperty("custom.datasource.pass");

        String defaultUrl = String.format("jdbc:postgresql://%s:%s/postgres", host, port);

        try (Connection conn = DriverManager.getConnection(defaultUrl, user, pass);
             Statement stmt = conn.createStatement()) {

            stmt.executeUpdate("CREATE DATABASE \"" + dbName + "\"");
            System.out.println("Database created: " + dbName);
        } catch (SQLException e) {
            if (e.getMessage().contains("already exists")) {
                System.out.println("Database already exists: " + dbName);
            } else {
                System.err.println("Database creation failed: " + e.getMessage());
            }
        }
    }
}