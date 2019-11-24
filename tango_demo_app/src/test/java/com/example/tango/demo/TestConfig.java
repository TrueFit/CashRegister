package com.example.tango.demo;

import com.example.cash_register.shared.spring.SpringContextUtils;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

@SpringBootConfiguration
@Import(SpringContextUtils.class)
@ComponentScan(basePackages = {
        "com.example.cash_register.shared",
        "com.example.cash_register.currency",
        "com.example.tango.lib",
        "com.example.tango.demo.lib",
        "com.example.tango.demo.application",
})
public class TestConfig {

}
