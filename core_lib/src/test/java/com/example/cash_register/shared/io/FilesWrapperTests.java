package com.example.cash_register.shared.io;

import com.example.cash_register.shared.resources.SpringResourceUtils;
import org.apache.commons.io.FileUtils;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.nio.file.Path;
import java.nio.file.attribute.FileAttribute;

import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@SpringBootTest
public class FilesWrapperTests {
    @Autowired
    private FilesWrapper filesWrapper;

    @Autowired
    private SpringResourceUtils springResourceUtils;

    @Test
    public void createTempDirectory_test() {
        final Path tempDirectory = this.filesWrapper.createTempDir();
        FileUtils.deleteQuietly(tempDirectory.toFile());
    }

    @Test(expected = FilesWrapper.CreateTempDirException.class)
    public void createTempDirectory_CreateTempDirectoryException_test() {
        this.filesWrapper.createTempDir(null, (FileAttribute<?>) null);
    }

    @Test
    public void createTempFile_test() {
        final Path tempFile = this.filesWrapper.createTempFile();
        FileUtils.deleteQuietly(tempFile.toFile());
    }

    @Test
    public void readString_test() {
        Path tempFile = null;
        try {
            tempFile = this.springResourceUtils.copyLocationToSystemTempDir("/cash_register.properties");
            final String string = this.filesWrapper.readString(tempFile);
            MatcherAssert.assertThat(string, notNullValue());
        }
        finally {
            if (tempFile != null) {
                FileUtils.deleteQuietly(tempFile.toFile());
            }
        }
    }

    @Test(expected = FilesWrapper.ReadStringException.class)
    public void readString_ReadStringException_test() {
        this.filesWrapper.readString(null);
    }

    @Test(expected = FilesWrapper.CreateTempFileException.class)
    public void createTempFile_CreateTempFileException_test() {
        this.filesWrapper.createTempFile(null, null, (FileAttribute<?>) null);
    }

    @Test(expected = FilesWrapper.NewBufferedWriterWrapperException.class)
    public void newBufferedWriter_NewBufferedWriterWrapperException_test() {
        this.filesWrapper.newBufferedWriter(null);
    }

}
