package com.example.cash_register.shared.resources;

import com.example.cash_register.shared.StringConstants;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

/**
 * Provides validation checks for resource name and resource location strings.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Component(ResourceStringValidator.QUALIFIER)
public final class ResourceStringValidator {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.shared.resources.ResourceStringValidator";

    /**
     * Checks a resource string
     *
     * @param resourceString The resource string to check.
     *
     * @throws ResourceStringIsBlankException When {@code resourceString} is null, empty, or whitespace.
     * @throws ResourceStringIsFullStopException When {@code resourceString} is a full stop.
     */
    public void checkResourceString(final String resourceString) {
        if (StringUtils.isBlank(resourceString)) {
            throw new ResourceStringIsBlankException();
        }
        if (StringConstants.FULL_STOP.equals(resourceString)) {
            throw new ResourceStringIsFullStopException();
        }
    }

    /**
     * See {@link #checkResourceString(String)}
     *
     * @see #checkResourceString(String)
     */
    public final static class ResourceStringIsBlankException extends RuntimeException {
        ResourceStringIsBlankException() {
            super("resource string must not be null, empty, or whitespace");
        }
    }

    /**
     * See {@link #checkResourceString(String)}
     *
     * @see #checkResourceString(String)
     */
    public final static class ResourceStringIsFullStopException extends RuntimeException {
        ResourceStringIsFullStopException() {
            super("resource string must not be a full stop");
        }
    }
}
