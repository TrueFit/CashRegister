package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import com.example.cash_register.shared.exceptions.CompoundException;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.StringWriter;
import java.io.Writer;
import java.util.Collections;
import java.util.List;
import java.util.function.Supplier;

import static com.example.cash_register.shared.exceptions.OnlyOneException.ForCompoundException.compoundExceptionOnlyOneException;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.StringContains.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.spy;

@SuppressWarnings("UnnecessaryLocalVariable")
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CalculateChangeResultsWriterWriteTests {
    @Autowired
    private CalculateChangeWorkflowRunner workflowRunner;

    @Autowired
    private InputStreamTranslatorResourceName inputTranslator;

    @Autowired
    private CalculateChangeArgs.InputModelParser inputParser;

    @Autowired
    private ChangeCalculatorFewest calculatorFewest;

    @Test(expected = CalculateChangeResultsWriter.WriteResultCollectionNullException.class)
    public void write_WriteResultCollectionNullException_test() {
        CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.create(Writer.nullWriter());
        writer.write((List<CalculateChangeResult>) null);
    }

    @Test(expected = CalculateChangeResultsWriter.WriteResultCollectionEmptyException.class)
    public void write_WriteResultCollectionEmptyException_test() {
        CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.create(Writer.nullWriter());
        writer.write(Collections.emptyList());
    }

    @Test(expected = CalculateChangeResultsWriter.WriteResultNullException.class)
    public void write_WriteResultNullException_test() {
        CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.create(Writer.nullWriter());
        writer.write((CalculateChangeResult) null);
    }

    @Test
    public void write_withUnsuccessfulResult_test() {
        final CalculateChangeResult result = this.createUnsuccessfulResult();
        final String uuid = result.getUuid().toString();

        final String string = this.writeWrapper(result);
        MatcherAssert.assertThat(string, notNullValue());
        MatcherAssert.assertThat(string, containsString(uuid));
    }

    @Test
    public void write_withSuccessfulResult_test() {
        final CalculateChangeResult result = this.createSuccessfulResult();
        final String string = this.writeWrapper(result);
        MatcherAssert.assertThat(string, notNullValue());
    }

    @Test(expected = CalculateChangeResultsWriter.CloseException.class)
    public void write_CloseException_test() {
        final StringWriter exceptionOnClose = this.mockStringWriterCloseException(MockOutputCloseException::new);
        final CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.create(exceptionOnClose);
        try {
            writer.close();
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(compoundException, compoundExceptionOnlyOneException(CalculateChangeResultsWriter.CloseException.class));
            throw (CalculateChangeResultsWriter.CloseException) compoundException.getExceptionList().iterator().next();
        }
    }

    @Test(expected = CalculateChangeResultsWriter.WriteResultsObjectMapperWriteValueException.class)
    public void write_WriteResultsObjectMapperWriteValueException_test() {
        final StringWriter exceptionOnWrite = this.mockStringWriterWriteException(MockOutputWriteException::new);
        this.writeWrapperValidResults(exceptionOnWrite);
    }

    private CalculateChangeResult createUnsuccessfulResult() {
        String resourceName = "/com/example/cash_register/currency/input_sets/unsuccessful_single_input.json";
        List<CalculateChangeResult> resultList = this.createResultListFromResourceName(resourceName);
        return resultList.get(0);
    }

    private CalculateChangeResult createSuccessfulResult() {
        String resourceName = "/com/example/cash_register/currency/input_sets/successful_single_input.json";
        List<CalculateChangeResult> resultList = this.createResultListFromResourceName(resourceName);
        return resultList.get(0);
    }

    private List<CalculateChangeResult> createResultListFromResourceName(String resourceName) {
        List<CalculateChangeResult> resultList = this.workflowRunner.runWorkflow(
                resourceName,
                this.inputTranslator,
                this.inputParser,
                this.calculatorFewest);
        return resultList;
    }

    private String writeWrapper(final CalculateChangeResult result) {
        return this.writeWrapper(result, new StringWriter());
    }

    private String writeWrapper(final CalculateChangeResult result, final StringWriter outputWriter) {
        try (CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.create(outputWriter)) {
            writer.write(result);
        }
        return outputWriter.toString();
    }

    private void writeWrapperValidResults(StringWriter outputWriter) {
        CalculateChangeResult result = this.createSuccessfulResult();
        this.writeWrapper(result, outputWriter);
    }

    private StringWriter mockStringWriterCloseException(Supplier<RuntimeException> supplier) {
        StringWriter mock = spy(StringWriter.class);
        try {
            doThrow(supplier.get())
                    .when(mock)
                    .close();
        }
        catch (final Throwable throwable) {
            throw new RuntimeException(throwable);
        }
        return mock;
    }

    private StringWriter mockStringWriterWriteException(Supplier<RuntimeException> supplier) {
        StringWriter mock = spy(StringWriter.class);
        doThrow(supplier.get())
                .when(mock)
                .write(any(char[].class), anyInt(), anyInt());
        return mock;
    }

    private static final class MockOutputWriteException extends RuntimeException {
    }

    private static final class MockOutputCloseException extends RuntimeException {
    }
}
