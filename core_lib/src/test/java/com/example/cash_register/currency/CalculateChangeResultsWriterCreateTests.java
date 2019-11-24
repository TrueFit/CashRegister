package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CalculateChangeResultsWriterCreateTests {
    @Test
    public void createTempDirectoryWriter_test() {
        final CalculateChangeResultsWriter tempDirectoryWriter = CalculateChangeResultsWriter.createTempDirectoryWriter();
        final Path tempDirectory = tempDirectoryWriter.queryCreatedTempDirectory();
        try {
            MatcherAssert.assertThat(tempDirectoryWriter, notNullValue());
        }
        finally {
            FileUtils.deleteQuietly(tempDirectory.toFile());
        }
    }

    @Test
    public void createBuildDirectoryWriter_test() {
        CalculateChangeResultsWriter.createBuildDirectoryWriter();
    }

    @Test(expected = CalculateChangeResultsWriter.CreateTempDirectoryWriterException.class)
    public void createTempDirectoryWriter_CreateTempDirectoryWriterOutputFileNullException_test() {
        CalculateChangeResultsWriter.createTempDirectoryWriter(null);
    }

    @Test
    public void create_test() throws IOException {
        Path tempFile = Files.createTempFile(
                RandomStringUtils.randomAlphabetic(10),
                RandomStringUtils.randomAlphabetic(10));
        try {
            CalculateChangeResultsWriter.create(tempFile);
        }
        finally {
            FileUtils.deleteQuietly(tempFile.toFile());
        }
    }

    @Test
    public void queryCreatedTempDirectory_test() {
        final CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.createTempDirectoryWriter();
        final Path path = writer.queryCreatedTempDirectory();
        try {
            MatcherAssert.assertThat(path, notNullValue());
        }
        finally {
            FileUtils.deleteQuietly(path.toFile());
        }
    }

    @Test(expected = CalculateChangeResultsWriter.QueryCreatedTempDirectoryException.class)
    public void queryCreatedTempDirectory_QueryCreatedTempDirectoryException_test() {
        final CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.create(new StringWriter());
        writer.queryCreatedTempDirectory();
    }
}
