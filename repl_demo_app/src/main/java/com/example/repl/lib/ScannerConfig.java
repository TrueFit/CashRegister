package com.example.repl.lib;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.Scanner;

/**
 * Spring beans for {@link Scanner}.
 */
@Configuration
class ScannerConfig {
    /**
     * Spring qualifier.
     */
    static final String SCANNER_QUALIFIER = "com.example.repl.lib.ScannerConfig.scanner";
    /**
     * The autowired input stream.
     */
    @Autowired
    private InputStream inputStream;

    /**
     * The {@link Scanner} bean.
     *
     * @return The {@link Scanner} bean.
     */
    @Bean
    Scanner scanner() {
        return new Scanner(this.inputStream);
    }
}
