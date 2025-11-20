package ITS.com.vn.identity_service.repository;

import ITS.com.vn.identity_service.model.TokenSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenSessionRepository extends JpaRepository<TokenSession, Long> {
    Optional<TokenSession> findByRefreshToken(String refreshToken);
    List<TokenSession> findByUsername(String username);
    void deleteByRefreshToken(String refreshToken);
}