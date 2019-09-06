package com.example.repl.application;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.ComponentScan;

/**
 * Spring boot application entry point.
 */
@ComponentScan(
        basePackages = {
                "com.example.cash_register.shared",
                "com.example.cash_register.currency",
                "com.example.tango.lib",
                "com.example.repl.lib",
                "com.example.repl.application",
        })
@SpringBootApplication
@NoArgsConstructor(access = AccessLevel.PACKAGE)
public
class ReplApplication {
    public static void main(String... args) {
        new SpringApplicationBuilder(ReplApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }
}
