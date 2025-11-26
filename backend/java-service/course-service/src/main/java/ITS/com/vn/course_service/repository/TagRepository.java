package ITS.com.vn.course_service.repository;

import ITS.com.vn.course_service.domain.entity.Tag;
import ITS.com.vn.course_service.domain.enums.TagType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    // Find by name
    Optional<Tag> findByName(String name);

    // Find by type
    List<Tag> findByType(TagType type);

    // Check if tag exists by name
    boolean existsByName(String name);
}
