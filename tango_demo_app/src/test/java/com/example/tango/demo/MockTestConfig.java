package com.example.tango.demo;

import com.example.cash_register.shared.resources.SpringResourceUtils;
import com.example.cash_register.shared.spring.SpringContextUtils;
import org.apache.commons.io.FileUtils;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.awt.FileDialog;
import java.io.File;
import java.nio.file.Path;

@Configuration
@Import(TestConfig.class)
public class MockTestConfig {
    public static final ApplicationArguments EMPTY_APPLICATION_ARGUMENTS = new DefaultApplicationArguments(new String[0]);

    @MockBean
    private FileDialog fileDialog;

    @Autowired
    private SpringResourceUtils springResourceUtils;

    @Autowired
    private SpringContextUtils springContextUtils;

    private Path inputFile;

    @PostConstruct
    private void postConstruct() {
        inputFile = this.springResourceUtils.copyLocationToSystemTempDir("/com/example/tango/input/good_input.txt");
        this.resetMocks();
    }

    public void resetMocks() {
        Mockito.reset(this.fileDialog);
        Mockito.doReturn(new File[]{inputFile.toFile()})
                .when(this.fileDialog)
                .getFiles();
    }

    @PreDestroy
    private void preDestroy() {
        FileUtils.deleteQuietly(inputFile.toFile());
    }
}
