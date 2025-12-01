package ITS.com.vn.assessment_service.repository;

import ITS.com.vn.assessment_service.domain.Document;
import ITS.com.vn.assessment_service.domain.enums.DocumentCategory;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    Optional<Document> findByIdAndUserId(UUID id, UUID userId);

    List<Document> findByUserId(UUID userId, Sort sort);

    long countByUserId(UUID userId);

    long countByUserIdAndCategory(UUID userId, DocumentCategory category);

    long countByUserIdAndIsFavoriteTrue(UUID userId);
}
