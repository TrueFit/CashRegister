package com.example.cash_register.shared.properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring beans for {@link PropertiesUtils}.
 */
@Configuration
class PropertiesUtilsConfig {
    /**
     * The bean for {@link PropertiesUtils}.
     *
     * @return The bean for {@link PropertiesUtils}.
     */
    @Bean
    PropertiesUtils propertiesUtils() {
        return new PropertiesUtils();
    }
}
