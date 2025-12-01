package ITS.com.vn.user_profile_service.dto.document;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteToggleRequest {
    @NotNull
    private Boolean isFavorite;
}
