package ITS.com.vn.identity_service.repository;

import ITS.com.vn.identity_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByGmail(String gmail);
    Optional<User> findByUserName(String userName);
}

