package ITS.com.vn.user_profile_service.repository;

import ITS.com.vn.user_profile_service.domain.entity.Document;
import ITS.com.vn.user_profile_service.domain.enums.DocumentCategory;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
    Optional<Document> findByIdAndUserId(UUID id, UUID userId);

    List<Document> findByUserId(UUID userId, Sort sort);

    long countByUserId(UUID userId);

    long countByUserIdAndCategory(UUID userId, DocumentCategory category);

    long countByUserIdAndIsFavoriteTrue(UUID userId);
}
