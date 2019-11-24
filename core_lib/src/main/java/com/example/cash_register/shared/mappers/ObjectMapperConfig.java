package com.example.cash_register.shared.mappers;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring beans for Jackson {@link ObjectMapper}
 */
@Configuration
public class ObjectMapperConfig {
    public static final String JSON_OBJECT_MAPPER_QUALIFIER =
            "com.example.cash_register.shared.mappers.ObjectMapperConfig.jsonObjectMapper";

    /**
     * The {@link ObjectMapper} bean.
     *
     * @return The {@link ObjectMapper} bean.
     */
    @Bean(JSON_OBJECT_MAPPER_QUALIFIER)
    public ObjectMapper jsonObjectMapper() {
        final JsonFactory jsonFactory = new JsonFactory();
        jsonFactory.configure(JsonGenerator.Feature.AUTO_CLOSE_TARGET, false);

        return new ObjectMapper(jsonFactory);
    }
}
