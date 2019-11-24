package com.example.repl.lib;

import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.CalculateChangeWorkflowRunner;
import com.example.cash_register.currency.ChangeCalculatorBase;
import com.example.cash_register.currency.CurrencyModelMapper;
import com.example.cash_register.currency.InputParserBase;
import com.example.cash_register.shared.exceptions.CompoundException;
import com.example.cash_register.shared.mappers.JsonObjectMapperWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
     * See {@link ReplInputOutput}.
     */
    private final ReplInputOutput replInputOutput;
    /**
     * See {@link CalculateChangeWorkflowRunner}.
     */
    private final CalculateChangeWorkflowRunner calculateChangeWorkflowRunner;
    /**
     * See {@link ReplState}.
     */
    private final ReplState replState;
    /**
     * See {@link InputParserReplState}.
     */
    private final InputParserReplState inputParserReplState;
    /**
     * See {@link CurrencyModelMapper}.
     */
    private final CurrencyModelMapper currencyModelMapper;
    /**
     * See {@link JsonObjectMapperWrapper}.
     */
    private final JsonObjectMapperWrapper jsonObjectMapperWrapper;

    /**
     * Autowired constructor
     *
     * @param calculateChangeWorkflowRunner See {@link CalculateChangeWorkflowRunner}.
     * @param currencyModelMapper See {@link CurrencyModelMapper}.
     * @param inputParserReplState See {@link InputParserReplState}.
     * @param jsonObjectMapperWrapper See {@link JsonObjectMapperWrapper}.
     * @param replInputOutput See {@link ReplInputOutput}.
     * @param replState See {@link ReplState}
     */
    @Autowired
    ReplWorkflowRunner(
            final CalculateChangeWorkflowRunner calculateChangeWorkflowRunner,
            final CurrencyModelMapper currencyModelMapper,
            final InputParserReplState inputParserReplState,
            final JsonObjectMapperWrapper jsonObjectMapperWrapper,
            final ReplInputOutput replInputOutput,
            final ReplState replState) {
        this.calculateChangeWorkflowRunner = calculateChangeWorkflowRunner;
        this.currencyModelMapper = currencyModelMapper;
        this.inputParserReplState = inputParserReplState;
        this.jsonObjectMapperWrapper = jsonObjectMapperWrapper;
        this.replInputOutput = replInputOutput;
        this.replState = replState;
    }

    /**
     * Runs the calculate change workflow with the current owed, tendered, and calculator value in the REPL state.
     *
     * @see CalculateChangeWorkflowRunner#runWorkflow(Object, InputParserBase, ChangeCalculatorBase)
     */
    void runWorkflow() {
        final List<CalculateChangeResult> resultList =
                this.calculateChangeWorkflowRunner.runWorkflow(
                        this.replState,
                        this.inputParserReplState,
                        this.replState.getChangeCalculator());
        final CalculateChangeResult result = resultList.get(0);
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

            this.replInputOutput.writeLine("---");
            this.replInputOutput.write(" Output locale: ");
            this.replInputOutput.writeLine(this.replState.getInputLocale().toLanguageTag());
            this.replInputOutput.write(" OK: ");
            this.replInputOutput.writeLine(jsonOutputModel);
            this.replInputOutput.writeLine("---");
            this.replInputOutput.flush();
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
