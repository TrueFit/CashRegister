package com.example.tango.lib;

import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.shared.exceptions.CompoundException;
import com.example.cash_register.shared.io.FilesWrapper;
import com.example.cash_register.shared.io.WriterWrapper;
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

import static com.example.cash_register.shared.exceptions.OnlyOneException.ForCompoundException.compoundExceptionOnlyOneException;
import static org.hamcrest.core.IsInstanceOf.instanceOf;

@SuppressWarnings("UnnecessaryLocalVariable")
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestConfig.class)
public class TangoResultsWriterMockTests {
    @Autowired
    private TangoResultsWriterTestsUtils testUtils;

    @Autowired
    private FilesWrapper filesWrapper;

    @SpyBean
    private WriterWrapper writerWrapper;

    @After
    public void after() {
        Mockito.reset(this.writerWrapper);
    }

    /**
     * Mocks an exception when {@link Writer#close()} is called on the error details writer.
     */
    @Test(expected = MockErrorDetailsWriterCloseException.class)
    public void write_MockErrorDetailsWriterCloseException_test() {
        final Writer mock = this.testUtils.mockWriterExceptionOnClose(MockErrorDetailsWriterCloseException::new);
        final TangoResultsWriter resultsWriter = TangoResultsWriter.create(StringWriter.nullWriter(), mock);
        final CalculateChangeResult result = this.testUtils.createUnsuccessfulResult();
        try {
            resultsWriter.write(result);
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(
                    compoundException,
                    compoundExceptionOnlyOneException(MockErrorDetailsWriterCloseException.class));
            RuntimeException throwable = (RuntimeException) compoundException.getExceptionList().iterator().next();
            throw throwable;
        }
    }

    /**
     * Mocks an exception when {@link Writer#close()} is called on the change output and error summary writer.
     */
    @Test(expected = MockChangeOutputAndErrorSummaryWriterCloseException.class)
    public void write_MockChangeOutputAndErrorSummaryWriterCloseException_test() {
        final Writer mock = this.testUtils.mockWriterExceptionOnClose(MockChangeOutputAndErrorSummaryWriterCloseException::new);
        final TangoResultsWriter resultsWriter = TangoResultsWriter.create(mock, StringWriter.nullWriter());
        final CalculateChangeResult result = this.testUtils.createUnsuccessfulResult();
        try {
            resultsWriter.write(result);
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(
                    compoundException,
                    compoundExceptionOnlyOneException(MockChangeOutputAndErrorSummaryWriterCloseException.class));
            RuntimeException throwable = (RuntimeException) compoundException.getExceptionList().iterator().next();
            throw throwable;
        }
    }

    @Test(expected = TangoResultsWriter.ErrorDetailsObjectMapperWriteValueException.class)
    public void write_ErrorWriterObjectMapperWriteValueException_test() {
        final Writer mock = this.testUtils.mockWriterExceptionOnWrite(MockObjectMapperWriteValueException::new);
        final TangoResultsWriter resultsWriter = TangoResultsWriter.create(StringWriter.nullWriter(), mock);
        final CalculateChangeResult result = this.testUtils.createUnsuccessfulResult();
        try {
            resultsWriter.write(result);
        }
        catch (final TangoResultsWriter.ErrorDetailsObjectMapperWriteValueException exception) {
            final Throwable rootCause = ExceptionUtils.getRootCause(exception);
            MatcherAssert.assertThat(rootCause, instanceOf(MockObjectMapperWriteValueException.class));
            throw exception;
        }
    }

    @Test(expected = TangoResultsWriter.ErrorDuringWriteOfChangeOutputForSuccessfulResultException.class)
    public void write_ErrorDuringOutputWriterWriteOfSuccessfulResultsException_test() {
        final Writer mock = this.testUtils.mockWriterExceptionOnWrite(MockChangeOutputWriteException::new);
        final TangoResultsWriter resultsWriter = TangoResultsWriter.create(mock, StringWriter.nullWriter());
        final CalculateChangeResult result = this.testUtils.createSuccessfulResult();
        try {
            resultsWriter.write(result);
        }
        catch (final TangoResultsWriter.ErrorDuringWriteOfChangeOutputForSuccessfulResultException exception) {
            final Throwable rootCause = ExceptionUtils.getRootCause(exception);
            MatcherAssert.assertThat(rootCause, instanceOf(MockChangeOutputWriteException.class));
            throw exception;
        }
    }

    @Test(expected = TangoResultsWriter.ErrorDuringWriteOfErrorSummaryForUnsuccessfulResultException.class)
    public void write_ErrorWhileWritingUnsuccessfulResultsToOutputWriterException_test() {
        final Writer mock = this.testUtils.mockWriterExceptionOnWrite(MockErrorSummaryWriteException::new);
        final TangoResultsWriter resultsWriter = TangoResultsWriter.create(mock, StringWriter.nullWriter());
        final CalculateChangeResult result = this.testUtils.createUnsuccessfulResult();
        try {
            resultsWriter.write(result);
        }
        catch (final TangoResultsWriter.ErrorDuringWriteOfErrorSummaryForUnsuccessfulResultException exception) {
            final Throwable rootCause = ExceptionUtils.getRootCause(exception);
            MatcherAssert.assertThat(rootCause, instanceOf(MockErrorSummaryWriteException.class));
            throw exception;
        }
    }

    private static final class MockErrorDetailsWriterCloseException extends RuntimeException {

    }

    private static final class MockChangeOutputAndErrorSummaryWriterCloseException extends RuntimeException {

    }

    private static final class MockObjectMapperWriteValueException extends RuntimeException {

    }

    private static final class MockErrorSummaryWriteException extends RuntimeException {

    }

    private static final class MockChangeOutputWriteException extends RuntimeException {

    }
}
