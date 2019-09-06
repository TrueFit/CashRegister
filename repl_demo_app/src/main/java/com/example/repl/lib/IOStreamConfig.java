package com.example.repl.lib;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.io.OutputStream;

/**
 * Spring beans for input and output streams.
 */
@SuppressWarnings("SameReturnValue")
@Configuration
public class IOStreamConfig {
    /**
     * The spring bean for input stream.
     *
     * @return The spring bean for input stream.
     */
    @Bean
    InputStream inputStream() {
        return System.in;
    }

    /**
     * The spring bean for output stream.
     *
     * @return The spring bean for output stream.
     */
    @Bean
    OutputStream outputStream() {
        return System.out;
    }
}
