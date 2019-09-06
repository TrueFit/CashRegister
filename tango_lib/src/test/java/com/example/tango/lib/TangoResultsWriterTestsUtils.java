package com.example.tango.lib;

import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.CalculateChangeWorkflowRunner;
import com.example.cash_register.currency.CurrencyModelMapper;
import com.example.cash_register.currency.InputStreamTranslatorResourceName;
import com.example.cash_register.shared.io.FilesWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.List;
import java.util.function.Supplier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.spy;

@SuppressWarnings("UnnecessaryLocalVariable")
@Component
class TangoResultsWriterTestsUtils {
    @Autowired
    private CurrencyModelMapper currencyModelMapper;

    @Autowired
    private CalculateChangeWorkflowRunner workflowRunner;

    @Autowired
    private InputStreamTranslatorResourceName inputTranslator;

    @Autowired
    private TangoInputParser inputParser;

    @Autowired
    private TangoChangeCalculator tangoChangeCalculator;

    @Autowired
    private FilesWrapper filesWrapper;

    /**
     * Creates a {@code List<CalculateChangeResult>} from unsuccessful input (where the tendered value is less than the
     * owed value).
     *
     * @return The {@code List<CalculateChangeResult>} with unsuccessful results.
     */
    CalculateChangeResult createUnsuccessfulResult() {
        final String resourceName = "/com/example/tango/input/unsuccessful_input.txt";
        final List<CalculateChangeResult> resultList = this.createResultListFromResourceName(resourceName);
        return resultList.get(0);
    }

    /**
     * Creates a {@code List<CalculateChangeResult>} from successful input.
     *
     * @return The {@code List<CalculateChangeResult>} with successful results.
     */
    CalculateChangeResult createSuccessfulResult() {
        final String resourceName = "/com/example/tango/input/successful_input.txt";
        final List<CalculateChangeResult> resultList = this.createResultListFromResourceName(resourceName);
        return resultList.get(0);
    }

    /**
     * Runs the resource specified by {@code resourceName} through the calculate change workflow.
     *
     * @param resourceName The resource name for input.
     *
     * @return The list of results.
     *
     * @see #createUnsuccessfulResult()
     * @see #createSuccessfulResult()
     */
    private List<CalculateChangeResult> createResultListFromResourceName(String resourceName) {
        final List<CalculateChangeResult> resultList = this.workflowRunner.runWorkflow(
                resourceName,
                this.inputTranslator,
                this.inputParser,
                this.tangoChangeCalculator);
        return resultList;
    }

    /**
     * Test helper method to write results to a {@code String[]}.
     *
     * @param result The results to write.
     * @param changeOutputAndErrorSummaryWriter The output writer.
     * @param errorDetailsWriter The error writer.
     *
     * @return A string array with two elements: element {@code [0]} contains what was written to the output writer,
     * element {@code [1]} contains what was written to the error writer.
     */
    private String[] writeWrapper(CalculateChangeResult result, StringWriter changeOutputAndErrorSummaryWriter, StringWriter errorDetailsWriter) {
        try (TangoResultsWriter writer = TangoResultsWriter.create(changeOutputAndErrorSummaryWriter, errorDetailsWriter)) {
            writer.write(result);
        }

        final String[] stringArray = new String[2];
        stringArray[0] = changeOutputAndErrorSummaryWriter.toString();
        stringArray[1] = errorDetailsWriter.toString();
        return stringArray;
    }


    /**
     * Test helper method to write results to a {@code String[]}.
     *
     * @param result The result to write.
     *
     * @return See {@link #writeWrapper(CalculateChangeResult, StringWriter, StringWriter)}
     */
    String[] writeWrapper(CalculateChangeResult result) {
        return this.writeWrapper(result, new StringWriter(), new StringWriter());
    }

    /**
     * Create a mock writer which will exception when {@link Writer#write(String)} or {@link Writer#write(char[], int,
     * int)} is invoked.
     *
     * @param runtimeExceptionSupplier Supplies the exception instance to be thrown.
     *
     * @return Mocked {@link Writer}.
     *
     * @see Writer#write(String)
     * @see Writer#write(char[], int, int)
     */
    public Writer mockWriterExceptionOnWrite(Supplier<RuntimeException> runtimeExceptionSupplier) {
        final StringWriter mock = spy(StringWriter.class);
        doThrow(runtimeExceptionSupplier.get())
                .when(mock)
                .write(any(char[].class), anyInt(), anyInt());
        doThrow(runtimeExceptionSupplier.get())
                .when(mock)
                .write(anyString());
        return mock;
    }

    /**
     * Create a mock writer which will exception when {@link Writer#close()} is invoked.
     *
     * @param runtimeExceptionSupplier Supplies the exception instance to be thrown.
     *
     * @return Mocked {@link Writer}.
     *
     * @see Writer#close()
     */
    Writer mockWriterExceptionOnClose(Supplier<RuntimeException> runtimeExceptionSupplier) {
        final StringWriter mock = spy(StringWriter.class);
        try {
            doThrow(runtimeExceptionSupplier.get())
                    .when(mock)
                    .close();
        }
        catch (final IOException ioException) {
            throw new IOExceptionWrapper(ioException);
        }
        return mock;
    }

    /**
     * See {@link #mockWriterExceptionOnClose(Supplier)}
     *
     * @see #mockWriterExceptionOnClose(Supplier)
     */
    static final class IOExceptionWrapper extends RuntimeException {
        private IOExceptionWrapper(Throwable cause) {
            super("an IOException was thrown during mock writer close invocation", cause);
        }
    }
}
