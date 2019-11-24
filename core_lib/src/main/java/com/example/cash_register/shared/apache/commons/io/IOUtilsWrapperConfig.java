package com.example.cash_register.shared.apache.commons.io;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring beans for {@link IOUtilsWrapper}.
 */
@Configuration
public class IOUtilsWrapperConfig {
    /**
     * Spring qualifier for {@link #ioUtilsWrapper()}.
     */
    public static final String IO_UTILS_WRAPPER_QUALIFIER =
            "com.example.cash_register.shared.apache.commons.io.IOUtilsWrapperConfig.ioUtilsWrapper";

    /**
     * {@link IOUtilsWrapper} bean.
     *
     * @return {@link IOUtilsWrapper} bean.
     *
     * @see IOUtilsWrapper
     */
    @Bean
    @Qualifier(IO_UTILS_WRAPPER_QUALIFIER)
    IOUtilsWrapper ioUtilsWrapper() {
        return new IOUtilsWrapper();
    }
}
