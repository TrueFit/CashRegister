package com.example.repl.lib;

import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.CalculateChangeWorkflowRunner;
import com.example.cash_register.currency.ChangeCalculatorBase;
import com.example.cash_register.currency.CurrencyModelMapper;
import com.example.cash_register.currency.InputParserBase;
import com.example.cash_register.shared.exceptions.CompoundException;
import com.example.cash_register.shared.io.WriterWrapper;
import com.example.cash_register.shared.mappers.JsonObjectMapperWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.util.List;

/**
 * Consolidates the information from the REPL loop, and uses that information to run the workflow which calculates the
 * appropriate change and prints the results.
 */
@Component(ReplWorkflowRunner.QUALIFIER)
class ReplWorkflowRunner {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.repl.lib.ReplWorkflowRunner";
    /**
     * The output writer.
     */
    private final BufferedWriter outputWriter;
    /**
     * The buffered writer wrapper.
     *
     * @see WriterWrapper
     */
    private final WriterWrapper writerWrapper;
    /**
     * The workflow runner.
     *
     * @see CalculateChangeWorkflowRunner
     */
    private final CalculateChangeWorkflowRunner calculateChangeWorkflowRunner;
    /**
     * The REPL state.
     *
     * @see ReplState
     */
    private final ReplState replState;
    /**
     * The input parser.
     *
     * @see InputParserReplState
     */
    private final InputParserReplState inputParserReplState;
    /**
     * The currency model mapper.
     */
    private final CurrencyModelMapper currencyModelMapper;
    /**
     * The JSON object mapper wrapper.
     */
    private final JsonObjectMapperWrapper jsonObjectMapperWrapper;

    /**
     * Autowired constructor
     *
     * @param outputWriter Output writer.
     * @param calculateChangeWorkflowRunner Calculate change workflow runner.
     * @param currencyModelMapper Currency model mapper.
     * @param inputParserReplState The REPL state input parser.
     * @param replState REPL state.
     * @param writerWrapper Buffered writer wrapper.
     * @param jsonObjectMapperWrapper JSON object mapper wrapper.
     */
    @Autowired
    ReplWorkflowRunner(
            BufferedWriter outputWriter,
            CalculateChangeWorkflowRunner calculateChangeWorkflowRunner,
            CurrencyModelMapper currencyModelMapper,
            InputParserReplState inputParserReplState,
            JsonObjectMapperWrapper jsonObjectMapperWrapper,
            ReplState replState,
            WriterWrapper writerWrapper) {
        this.calculateChangeWorkflowRunner = calculateChangeWorkflowRunner;
        this.currencyModelMapper = currencyModelMapper;
        this.inputParserReplState = inputParserReplState;
        this.jsonObjectMapperWrapper = jsonObjectMapperWrapper;
        this.outputWriter = outputWriter;
        this.replState = replState;
        this.writerWrapper = writerWrapper;
    }

    /**
     * Runs the calculate change workflow with the current owed, tendered, and calculator value in the REPL state.
     *
     * @see CalculateChangeWorkflowRunner#runWorkflow(Object, InputParserBase, ChangeCalculatorBase)
     */
    void runWorkflow() {
        List<CalculateChangeResult> resultList =
                this.calculateChangeWorkflowRunner.runWorkflow(
                        this.replState,
                        this.inputParserReplState,
                        this.replState.getChangeCalculator());
        CalculateChangeResult result = resultList.get(0);
        this.processResult(result);
    }

    /**
     * Processes the calculate change result object, and outputs the appropriate output.
     *
     * @param result The result to process.
     *
     * @throws UnsuccessfulResultException If the result is unsuccessful, then this exception will be thrown and its
     * cause will be a {@link CompoundException} which contains the collection of exceptions from the result.
     */
    private void processResult(final CalculateChangeResult result) {
        if (result.isSuccessful()) {
            final CalculateChangeResult.OutputModel outputModel =
                    this.currencyModelMapper.map(result, CalculateChangeResult.OutputModel.class);
            final String jsonOutputModel =
                    this.jsonObjectMapperWrapper.prettyWriteValueAsString(outputModel);

            this.writerWrapper.writeLine(this.outputWriter, "---");
            this.writerWrapper.write(this.outputWriter, " OK: ");
            this.writerWrapper.writeLine(this.outputWriter, jsonOutputModel);
            this.writerWrapper.writeLine(this.outputWriter, "---");
            this.writerWrapper.flush(this.outputWriter);
        }
        else {
            CompoundException compoundException = new CompoundException(result.getOutputResultExceptionList());
            throw new UnsuccessfulResultException(compoundException);
        }
    }

    /**
     * See {@link #processResult(CalculateChangeResult)}
     *
     * @see #processResult(CalculateChangeResult)
     */
    static final class UnsuccessfulResultException extends RuntimeException {
        UnsuccessfulResultException(Throwable cause) {
            super(cause);
        }
    }
}
