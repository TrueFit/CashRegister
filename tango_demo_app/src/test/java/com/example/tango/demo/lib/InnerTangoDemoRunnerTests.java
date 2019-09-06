package com.example.tango.demo.lib;

import com.example.cash_register.shared.resources.SpringResourceUtils;
import com.example.tango.demo.MockTestConfig;
import com.example.tango.lib.TangoProperties;
import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.awt.FileDialog;
import java.io.File;
import java.nio.file.Path;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = MockTestConfig.class)
public class InnerTangoDemoRunnerTests {
    private Path inputJsonFile;
    private Path inputTangoFile;
    private Path withFilesTempDir;
    @Autowired
    private InnerTangoDemoRunner innerTangoDemoRunner;
    @Autowired
    private TangoProperties tangoProperties;
    @Autowired
    private FileDialog fileDialog;
    @Autowired
    private MockTestConfig mockTestConfig;
    @Autowired
    private SpringResourceUtils springResourceUtils;

    @Before
    public void beforeClass() {
        withFilesTempDir = this.springResourceUtils.copyLocationPatternArrayToTempDir(
                "/com/example/tango/input/good_input.txt",
                "/com/example/tango/input/valid_single_input.json");
        inputTangoFile = withFilesTempDir.resolve("good_input.txt");
        inputJsonFile = withFilesTempDir.resolve("valid_single_input.json");
    }

    @After
    public void afterClass() {
        FileUtils.deleteQuietly(withFilesTempDir.toFile());
    }

    /**
     * Runs through the tango file processing.  See resource file {@code `/com/example/tango/input/good_input.txt`} in
     * this module.
     */
    @Test
    public void runImpl_withTangoFile_test() {
        this.doMockTangoFile();
        this.innerTangoDemoRunner.runImpl(MockTestConfig.EMPTY_APPLICATION_ARGUMENTS);
    }

    /**
     * Runs through the JSON file processing. See resource file {@code `/com/example/tango/input/valid_single_input.json`}
     * in the {@code `:tango_lib`} module.
     */
    @Test
    public void runImpl_withJsonFile_test() {
        this.doMockJsonFile();
        this.innerTangoDemoRunner.runImpl(MockTestConfig.EMPTY_APPLICATION_ARGUMENTS);
    }

    @Test(expected = InnerTangoDemoRunner.MultipleInputFileArgumentsProvidedException.class)
    public void runImpl_MultipleInputFileArgumentsProvidedException_test() {
        final String[] args = new String[2];
        args[0] = "--inputFile=anything1";
        args[1] = "--inputFile=anything2";
        DefaultApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
        this.innerTangoDemoRunner.runImpl(applicationArguments);
    }

    private void doMockTangoFile() {
        Mockito.doReturn(new File[]{inputTangoFile.toFile()})
                .when(this.fileDialog)
                .getFiles();
    }

    private void doMockJsonFile() {
        Mockito.doReturn(new File[]{inputJsonFile.toFile()})
                .when(this.fileDialog)
                .getFiles();
    }

    @After
    public void after() {
        this.tangoProperties.removeSystemPropertiesOverrides();
        this.mockTestConfig.resetMocks();
    }
}
