package com.example.tango.lib;

import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.CurrencyModelMapper;
import com.example.cash_register.shared.io.FilesWrapper;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.hamcrest.MatcherAssert;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.StringWriter;
import java.io.Writer;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.core.IsInstanceOf.instanceOf;
import static org.hamcrest.core.IsNot.not;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.StringContains.containsString;
import static org.mockito.Mockito.doThrow;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestConfig.class)
public class TangoResultsWriterTests {
    @SpyBean
    private CurrencyModelMapper currencyModelMapper;

    @Autowired
    private TangoResultsWriterTestsUtils testsUtils;

    @Autowired
    private FilesWrapper filesWrapper;

    @After
    public void after() {
        Mockito.reset(this.currencyModelMapper);
    }

    @Test(expected = TangoResultsWriter.WriteResultListNullException.class)
    public void write_WriteResultListNullException_test() {
        TangoResultsWriter writer = TangoResultsWriter.create(Writer.nullWriter(), Writer.nullWriter());
        writer.write((List<CalculateChangeResult>) null);
    }

    @Test(expected = TangoResultsWriter.WriteResultListEmptyException.class)
    public void write_WriteResultListEmptyException_test() {
        TangoResultsWriter writer = TangoResultsWriter.create(Writer.nullWriter(), Writer.nullWriter());
        writer.write(Collections.emptyList());
    }

    @Test(expected = TangoResultsWriter.WriteResultNullException.class)
    public void write_WriteResultNullException_test() {
        TangoResultsWriter writer = TangoResultsWriter.create(Writer.nullWriter(), Writer.nullWriter());
        writer.write((CalculateChangeResult) null);
    }

    @Test(expected = TangoResultsWriter.ModelMapperMapUnsuccessfulResultsToErrorModelException.class)
    public void write_ModelMapperMapUnsuccessfulResultsToErrorModelException_test() {
        doThrow(new MockWriteModelMapperMapUnsuccessfulResultsToErrorModelException())
                .when(this.currencyModelMapper)
                .mapToOutputModel(Mockito.anyList());
        try {
            this.testsUtils.writeWrapper(this.testsUtils.createSuccessfulResult());
        }
        catch (final TangoResultsWriter.ModelMapperMapUnsuccessfulResultsToErrorModelException exception) {
            Throwable rootCause = ExceptionUtils.getRootCause(exception);
            MatcherAssert.assertThat(
                    rootCause,
                    instanceOf(MockWriteModelMapperMapUnsuccessfulResultsToErrorModelException.class));
            throw exception;
        }
    }

    @Test
    public void write_withUnsuccessfulResults_test() {
        final CalculateChangeResult results = this.testsUtils.createUnsuccessfulResult();
        final String uuid = results.getUuid().toString();

        final String[] stringArray = this.testsUtils.writeWrapper(results);
        MatcherAssert.assertThat(stringArray[0], containsString(uuid));
        MatcherAssert.assertThat(stringArray[1], containsString(uuid));
    }

    @Test
    public void write_withSuccessfulResults_test() {
        final CalculateChangeResult results = this.testsUtils.createSuccessfulResult();
        final String uuid = results.getUuid().toString();

        final String[] stringArray = this.testsUtils.writeWrapper(results);
        MatcherAssert.assertThat(stringArray[0], not(containsString(uuid)));
        MatcherAssert.assertThat(stringArray[1], not(containsString(uuid)));
    }

    @Test
    public void createTempDirectoryWriter_test() {
        final TangoResultsWriter tempDirectoryWriter = TangoResultsWriter.createTempDirectoryWriter();
        Path tempDirectory = tempDirectoryWriter.queryCreatedTempDirectory();
        try {
            MatcherAssert.assertThat(tempDirectoryWriter, notNullValue());
        }
        finally {
            FileUtils.deleteQuietly(tempDirectory.toFile());
        }
    }

    @Test
    public void createBuildDirectoryWriter_test() {
        TangoResultsWriter.createBuildDirectoryWriter();
    }

    @Test
    public void create_withOutputPathAndErrorPath_test() {
        final Path changeOutputAndErrorSummaryFile = this.filesWrapper.createTempFile();
        final Path errorDetailsFile = this.filesWrapper.createTempFile();
        try {
            TangoResultsWriter.create(changeOutputAndErrorSummaryFile, errorDetailsFile);
        }
        finally {
            FileUtils.deleteQuietly(changeOutputAndErrorSummaryFile.toFile());
            FileUtils.deleteQuietly(errorDetailsFile.toFile());
        }
    }

    @Test
    public void queryChangeOutputAndErrorSummaryFile_test() {
        final TangoResultsWriter writer = TangoResultsWriter.createBuildDirectoryWriter();
        final Path path = writer.queryChangeOutputAndErrorSummaryFile();
        MatcherAssert.assertThat(path, notNullValue());
    }

    @Test
    public void queryErrorDetailsFile_test() {
        final TangoResultsWriter writer = TangoResultsWriter.createBuildDirectoryWriter();
        final Path path = writer.queryErrorDetailsFile();
        MatcherAssert.assertThat(path, notNullValue());
    }

    @Test
    public void queryCreatedTempDirectory_test() {
        final TangoResultsWriter writer = TangoResultsWriter.createTempDirectoryWriter();
        final Path path = writer.queryCreatedTempDirectory();
        try {
            MatcherAssert.assertThat(path, notNullValue());
        }
        finally {
            FileUtils.deleteQuietly(path.toFile());
        }
    }

    @Test(expected = TangoResultsWriter.QueryChangeOutputAndErrorSummaryFileException.class)
    public void queryOutputPath_QueryOutputPathException_test() {
        final TangoResultsWriter writer = TangoResultsWriter.create(new StringWriter(), new StringWriter());
        writer.queryChangeOutputAndErrorSummaryFile();
    }

    @Test(expected = TangoResultsWriter.QueryErrorDetailsFileException.class)
    public void queryErrorPath_QueryErrorPathException_test() {
        final TangoResultsWriter writer = TangoResultsWriter.create(new StringWriter(), new StringWriter());
        writer.queryErrorDetailsFile();
    }

    @Test(expected = TangoResultsWriter.QueryCreatedTempDirectoryException.class)
    public void queryCreatedTempDirectory_QueryCreatedTempDirectoryException_test() {
        final TangoResultsWriter writer = TangoResultsWriter.create(new StringWriter(), new StringWriter());
        writer.queryCreatedTempDirectory();
    }

    @Test(expected = TangoResultsWriter.CreateTempDirectoryWriterException.class)
    public void createTempDirectoryWriter_CreateTempDirectoryWriterException_test() {
        TangoResultsWriter.createTempDirectoryWriter(null, null);
    }

    private static final class MockWriteModelMapperMapUnsuccessfulResultsToErrorModelException extends RuntimeException {

    }
}
