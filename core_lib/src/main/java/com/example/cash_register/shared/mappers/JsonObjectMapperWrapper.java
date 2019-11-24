package com.example.cash_register.shared.mappers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

/**
 * Provides wrappers around methods from the {@link ObjectMapper} class, for {@link
 * ObjectMapperConfig#jsonObjectMapper()} bean.
 */
@Component
public class JsonObjectMapperWrapper {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.shared.mappers.JsonObjectMapperWrapper";

    /**
     * Autowired.  See {@link ObjectMapperConfig#jsonObjectMapper()}.
     */
    private final ObjectMapper jsonObjectMapper;

    /**
     * Autowired constructor.
     *
     * @param jsonObjectMapper See {@link ObjectMapperConfig#jsonObjectMapper()}.
     */
    JsonObjectMapperWrapper(
            @Qualifier(ObjectMapperConfig.JSON_OBJECT_MAPPER_QUALIFIER) final ObjectMapper jsonObjectMapper) {
        this.jsonObjectMapper = jsonObjectMapper;
    }

    /**
     * Direct wrapper around {@link ObjectWriter#writeValueAsString(Object)} with a pretty printer.
     *
     * @param value Per {@link ObjectWriter#writeValueAsString(Object)}
     *
     * @return Per {@link ObjectWriter#writeValueAsString(Object)}
     *
     * @see ObjectWriter#writeValueAsString(Object)
     */
    public String prettyWriteValueAsString(final Object value) {
        try {
            return this.jsonObjectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(value);
        }
        catch (final Throwable throwable) {
            throw new PrettyWriteValueAsStringException(throwable);
        }
    }

    /**
     * See {@link #prettyWriteValueAsString(Object)}
     *
     * @see #prettyWriteValueAsString(Object)
     */
    public static final class PrettyWriteValueAsStringException extends RuntimeException {
        private PrettyWriteValueAsStringException(final Throwable cause) {
            super("could not pretty write value as string", cause);
        }
    }
}
