package com.example.cash_register.shared.io;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring beans for {@link WriterWrapper}.
 *
 * @see WriterWrapper
 */
@Configuration
public class WriterWrapperConfig {
    public static final String WRITER_WRAPPER_QUALIFIER =
            "com.example.cash_register.shared.io.WriterWrapperConfig.writerWrapper";

    /**
     * {@link WriterWrapper} bean.
     *
     * @return The {@link WriterWrapper} bean.
     */
    @Bean(WRITER_WRAPPER_QUALIFIER)
    public WriterWrapper writerWrapper() {
        return new WriterWrapper();
    }
}
