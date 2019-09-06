package com.example.cash_register.shared.resources;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring beans for {@link ResourceUtils}
 */
@Configuration
public class ResourceUtilsConfig {
    /**
     * The Spring bean for {@link ResourceUtils}
     *
     * @return The Spring bean for {@link ResourceUtils}
     */
    @Bean
    public ResourceUtils resourceUtils() {
        return new ResourceUtils();
    }
}
