package com.example.cash_register.shared.io;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring beans for the {@link FilesWrapper}.
 *
 * @see FilesWrapper
 */
@Configuration
public class FilesWrapperConfig {
    public static final String QUALIFIER =
            "com.example.cash_register.shared.io.FilesWrapperConfig.filesWrapper";

    /**
     * {@link FilesWrapper} bean.
     *
     * @return The {@link FilesWrapper} bean.
     */
    @Bean
    public FilesWrapper filesWrapper() {
        return new FilesWrapper();
    }
}
