package ITS.com.vn.user_profile_service.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum DocumentCategory {
    NOTE,
    ASSIGNMENT,
    REFERENCE,
    PROJECT;

    @JsonCreator
    public static DocumentCategory fromValue(String value) {
        if (value == null) {
            return null;
        }
        return DocumentCategory.valueOf(value.trim().toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return name().toLowerCase(Locale.ROOT);
    }
}
