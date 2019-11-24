package com.example.tango.demo.lib;

import com.example.cash_register.shared.io.FilesWrapper;
import com.example.cash_register.shared.spring.SpringContextUtils;
import com.example.tango.demo.MockTestConfig;
import com.example.tango.lib.TangoProperties;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.hamcrest.MatcherAssert;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.awt.FileDialog;
import java.io.File;
import java.nio.file.Path;

import static org.hamcrest.core.IsInstanceOf.instanceOf;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = MockTestConfig.class)
public class InnerTangoDemoRunnerNonExistentFileTests {
    private Path emptyTempDir;
    @Autowired
    private InnerTangoDemoRunner innerTangoDemoRunner;
    @Autowired
    private TangoProperties tangoProperties;
    @Autowired
    private FileDialog fileDialog;
    @Autowired
    private MockTestConfig mockTestConfig;

    @Before
    public void beforeClass() {
        final FilesWrapper filesWrapper = SpringContextUtils.getBean(FilesWrapper.class);
        this.emptyTempDir = filesWrapper.createTempDir();
    }

    @After
    public void afterClass() {
        FileUtils.deleteQuietly(this.emptyTempDir.toFile());
    }

    @Test(expected = InnerTangoDemoRunner.InnerTangoDemoRunnerException.class)
    public void runImpl_InnerTangoDemoRunException_test() {
        try {
            this.doMockNonExistentFile();
            this.innerTangoDemoRunner.runImpl(MockTestConfig.EMPTY_APPLICATION_ARGUMENTS);
        }
        catch (final InnerTangoDemoRunner.InnerTangoDemoRunnerException exception) {
            final Throwable throwable = ExceptionUtils.getRootCause(exception);
            MatcherAssert.assertThat(throwable, instanceOf(InnerTangoDemoRunner.InputFileDoesNotExistException.class));
            throw exception;
        }
    }

    @Test(expected = InnerTangoDemoRunner.InnerTangoDemoRunnerException.class)
    public void runImpl_InputFileNullException_test() {
        try {
            this.doMockEmptyGetFiles();
            this.innerTangoDemoRunner.runImpl(MockTestConfig.EMPTY_APPLICATION_ARGUMENTS);
        }
        catch (final InnerTangoDemoRunner.InnerTangoDemoRunnerException exception) {
            final Throwable throwable = ExceptionUtils.getRootCause(exception);
            MatcherAssert.assertThat(throwable, instanceOf(InnerTangoDemoRunner.InputFileNullException.class));
            throw exception;
        }
    }

    private void doMockNonExistentFile() {
        final File nonExistentFile = emptyTempDir.resolve("anything").toFile();
        Mockito.doReturn(new File[]{nonExistentFile})
                .when(this.fileDialog)
                .getFiles();
    }

    private void doMockEmptyGetFiles() {
        Mockito.doReturn(new File[0])
                .when(this.fileDialog)
                .getFiles();
    }

    @After
    public void after() {
        this.tangoProperties.removeSystemPropertiesOverrides();
        this.mockTestConfig.resetMocks();
    }
}
