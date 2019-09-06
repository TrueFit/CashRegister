package com.example.repl.lib;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.BufferedWriter;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

/**
 * Spring beans for output writer.
 */
@Configuration
public class WriterConfig {
    /**
     * Autowired output stream.
     */
    @Autowired
    private OutputStream outputStream;

    /**
     * The bean for the output writer.
     *
     * @return The bean for the output writer.
     */
    @Bean
    BufferedWriter outputWriter() {
        return new BufferedWriter(new OutputStreamWriter(outputStream));
    }
}
