package ITS.com.vn.assessment_service.domain.enums;

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
        return DocumentCategory.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    @JsonValue
    public String toValue() {
        return name().toLowerCase(Locale.ROOT);
    }
}
