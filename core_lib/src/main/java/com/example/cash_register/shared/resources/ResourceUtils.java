package com.example.cash_register.shared.resources;

import com.example.cash_register.shared.spring.SpringContextUtils;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.io.IOUtils;

import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Utilities for working with resources.
 */
@NoArgsConstructor(access = AccessLevel.PACKAGE)
public class ResourceUtils {
    /**
     * Reads all lines from a resource.
     *
     * @param resourceName The resource name to read.
     *
     * @return A list of string containing the lines from the resource.
     *
     * @throws ReadLinesFromResourceException If {@link IOUtils#readLines(InputStream, Charset)} throws an exception,
     * that exception will be the cause.
     * @see ResourceStringValidator#checkResourceString(String)
     */
    public final List<String> readLinesFromResource(final String resourceName) {
        final ResourceStringValidator resourceStringValidator = SpringContextUtils.getBean(ResourceStringValidator.class);
        resourceStringValidator.checkResourceString(resourceName);
        try (final InputStream inputStream = this.getClass().getResourceAsStream(resourceName)) {
            return IOUtils.readLines(inputStream, StandardCharsets.UTF_8);
        }
        catch (final Throwable throwable) {
            final String message = String.format(
                    "could not read lines from resource: %s",
                    resourceName);
            throw new ReadLinesFromResourceException(message, throwable);
        }
    }

    /**
     * See {@link #readLinesFromResource(String)}
     *
     * @see #readLinesFromResource(String)
     */
    public static final class ReadLinesFromResourceException extends RuntimeException {
        private ReadLinesFromResourceException(final String message, final Throwable cause) {
            super(message, cause);
        }
    }
}
