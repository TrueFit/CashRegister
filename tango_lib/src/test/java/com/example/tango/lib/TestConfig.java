package com.example.tango.lib;

import com.example.cash_register.shared.spring.SpringContextUtils;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

@SpringBootConfiguration
@Import(SpringContextUtils.class)
@ComponentScan(
        basePackages = {
                "com.example.cash_register.shared",
                "com.example.cash_register.currency",
                "com.example.tango.lib",
        })
public class TestConfig {

}
