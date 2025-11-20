package ITS.com.vn.identity_service.service.keycloakService;

import ITS.com.vn.identity_service.exception.AppException;
import ITS.com.vn.identity_service.exception.StatusCode;
import jakarta.annotation.PostConstruct;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.OAuth2Constants;

import java.util.Collections;


@Service
public class KeycloakAdminService {

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    private Keycloak keycloak;

    @PostConstruct
    public void init() {
        keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();
    }

    public String createUser(String username, String email, String password) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);

        CredentialRepresentation cred = new CredentialRepresentation();
        cred.setType(CredentialRepresentation.PASSWORD);
        cred.setValue(password);
        cred.setTemporary(false);
        user.setCredentials(Collections.singletonList(cred));

        Response response = keycloak.realm(realm).users().create(user);
        if (response.getStatus() >= 400) {
            throw new AppException(StatusCode.CREATE_USER_FAIL);
        }
        String id = CreatedResponseUtil.getCreatedId(response);
        response.close();
        return id;
    }

    public void logoutUser(String keycloakUserId) {
        keycloak.realm(realm).users().get(keycloakUserId).logout();
    }

    public void resetUserPassword(String keycloakUserId, String newPassword) {
        CredentialRepresentation cred = new CredentialRepresentation();
        cred.setType(CredentialRepresentation.PASSWORD);
        cred.setValue(newPassword);
        cred.setTemporary(false);
        keycloak.realm(realm).users().get(keycloakUserId).resetPassword(cred);
    }
}
