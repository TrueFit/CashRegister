package com.example.tango.demo.application;

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
                "com.example.tango.demo.lib",
                "com.example.tango.demo.application",
        })
@SpringBootApplication
public class TangoDemoApplication {
    public static void main(String... args) {
        System.setProperty("java.awt.headless", "false");
        new SpringApplicationBuilder(TangoDemoApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }
}
