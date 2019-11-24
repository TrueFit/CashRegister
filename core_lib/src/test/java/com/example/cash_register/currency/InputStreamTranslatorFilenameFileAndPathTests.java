package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import com.example.cash_register.shared.apache.commons.io.IOUtilsWrapper;
import org.apache.commons.lang3.StringUtils;
import org.hamcrest.MatcherAssert;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class InputStreamTranslatorFilenameFileAndPathTests {
    private static final String FILE_CONTENT_UUID = UUID.randomUUID().toString();
    private static Path PATH;
    @Autowired
    private InputStreamTranslatorPath inputStreamTranslatorPath;
    @Autowired
    private InputStreamTranslatorFile inputStreamTranslatorFile;
    @Autowired
    private InputStreamTranslatorFilename inputStreamTranslatorFilename;
    @Autowired
    private IOUtilsWrapper ioUtilsWrapper;

    @BeforeClass
    public static void beforeClass() throws IOException {
        PATH = Files.createTempFile("prefix", "suffix");
        Files.writeString(PATH, FILE_CONTENT_UUID, StandardCharsets.UTF_8);
    }

    @AfterClass
    public static void afterClass() throws IOException {
        Files.deleteIfExists(PATH);
    }

    @Test(expected = InputStreamTranslatorFilename.FilenameIsBlankException.class)
    public void translate_FilenameIsBlankException_null_test() {
        this.inputStreamTranslatorFilename.translate(null);
    }

    @Test(expected = InputStreamTranslatorFilename.FilenameIsBlankException.class)
    public void translate_FilenameIsBlankException_empty_test() {
        this.inputStreamTranslatorFilename.translate(StringUtils.EMPTY);
    }

    @Test(expected = InputStreamTranslatorFilename.FilenameIsBlankException.class)
    public void translate_FilenameIsBlankException_whitespace_test() {
        this.inputStreamTranslatorFilename.translate(StringUtils.SPACE);
    }

    @Test(expected = InputStreamTranslatorFile.FileNullException.class)
    public void translate_FileNullException_test() {
        this.inputStreamTranslatorFile.translate(null);
    }

    @Test
    public void translatePath_test() {
        InputStream inputStream = this.inputStreamTranslatorPath.translate(PATH);
        String uuid = this.ioUtilsWrapper.toString(inputStream, StandardCharsets.UTF_8);
        MatcherAssert.assertThat(uuid, equalTo(FILE_CONTENT_UUID));
    }

    @Test
    public void translateFile_test() {
        InputStream inputStream = this.inputStreamTranslatorFile.translate(PATH.toFile());
        String uuid = this.ioUtilsWrapper.toString(inputStream, StandardCharsets.UTF_8);
        MatcherAssert.assertThat(uuid, equalTo(FILE_CONTENT_UUID));
    }

    @Test
    public void translateFilename_test() {
        InputStream inputStream = this.inputStreamTranslatorFilename.translate(PATH.toAbsolutePath().toString());
        String uuid = this.ioUtilsWrapper.toString(inputStream, StandardCharsets.UTF_8);
        MatcherAssert.assertThat(uuid, equalTo(FILE_CONTENT_UUID));
    }

    @Test(expected = InputStreamTranslatorPath.TranslateInputPathException.class)
    public void translatePath_TranslateInputPathException_test() {
        this.inputStreamTranslatorPath.translate(null);
    }
}
