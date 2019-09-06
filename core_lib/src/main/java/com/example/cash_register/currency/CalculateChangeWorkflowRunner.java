package com.example.cash_register.currency;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Used to consolidate and run the workflow to calculate change.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component(CalculateChangeWorkflowRunner.QUALIFER)
public final class CalculateChangeWorkflowRunner {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFER = "com.example.cash_register.currency.CalculateChangeWorkflowRunner";

    /**
     * Runs a calculate change workflow.
     *
     * @param input The input to use; this is an arbitrary object. For the tests in this project, it is commonly a
     * {@code String} resource name or file name, but it may be anything that has an appropriate translator.
     * @param inputTranslator This object extends {@link InputTranslatorBase}; it translates the {@code input} object
     * and supplies the output to the {@code inputParser} object. For the tests of this project, this most commonly
     * translates to an {@code InputStream}, but it may translate to anything which has an appropriate parser.
     * @param inputParser This object extends {@link InputParserBase}; it parses the data supplied from the {@code
     * inputTranslator} into a {@code List<CalculateChangeArgs>} used by the {@code changeCalculator}.
     * @param changeCalculator The object extends {@link ChangeCalculatorBase}; it calculates the change from the {@code
     * List<CalculateChangeArgs>} provided by {@code inputParser} and returns a {@code List<CalculateChangeResult>} with
     * the results.
     * @param <TInput> The input type of the first parameter which starts the workflow. The {@code inputTranslator} will
     * process the input type and provide a {@code TTranslation} to the {@code inputParser}.
     * @param <TTranslation> The type which is output from the {@code inputTranslator} and, thus, provided to the {@code
     * inputParser}.  Generally, this will be inferred from the parameters.
     *
     * @return The results of the change calculation.
     */
    public final <TInput, TTranslation> List<CalculateChangeResult> runWorkflow(
            final TInput input,
            final InputTranslatorBase<TInput, TTranslation> inputTranslator,
            final InputParserBase<TTranslation> inputParser,
            final ChangeCalculatorBase changeCalculator) {
        if (inputTranslator == null) {
            throw new TranslationInputNullException();
        }
        final TTranslation translation = inputTranslator.translate(input);
        return this.runWorkflow(translation, inputParser, changeCalculator);
    }

    /**
     * Runs a calculate change workflow, for which no translation is needed, because the {@code TInput} object is
     * already an instance of the object which the input parser expects.
     *
     * @param input The input to use; this is an arbitrary object which can be passed directly to the input parser.
     * @param inputParser The input parser, per {@link #runWorkflow(Object, InputTranslatorBase, InputParserBase,
     * ChangeCalculatorBase)}.
     * @param changeCalculator The change calculator, per {@link #runWorkflow(Object, InputTranslatorBase,
     * InputParserBase, ChangeCalculatorBase)}.
     * @param <TInput> The input type of the first parameter which starts the workflow.  This type is also what the
     * provided input parser will expect.
     *
     * @return The results of the change calculation.
     */
    public final <TInput> List<CalculateChangeResult> runWorkflow(
            final TInput input,
            final InputParserBase<TInput> inputParser,
            final ChangeCalculatorBase changeCalculator) {
        if (inputParser == null) {
            throw new ParserInputNullException();
        }
        final List<CalculateChangeArgs> inputArgsList = inputParser.parse(input);
        return this.runWorkflow(changeCalculator, inputArgsList);
    }

    /**
     * Runs a calculate change workflow by passing a list of calculate change args to the change calculator.
     *
     * @param changeCalculator The change calculator.
     * @param inputArgsList The input args list.
     *
     * @return The results of the change calculation.
     */
    public final List<CalculateChangeResult> runWorkflow(
            final ChangeCalculatorBase changeCalculator,
            final List<CalculateChangeArgs> inputArgsList) {
        if (inputArgsList == null) {
            throw new InputArgsListNullException();
        }
        if (inputArgsList.isEmpty()) {
            throw new InputArgsListEmptyException();
        }
        if (changeCalculator == null) {
            throw new ChangeCalculatorNullException();
        }
        final List<CalculateChangeResult> resultList = changeCalculator.calculate(inputArgsList);
        return resultList;
    }

    /**
     * Runs a calculate change workflow on a varargs array of calculate change args. Calls {@link
     * #runWorkflow(ChangeCalculatorBase, List)}.
     *
     * @param changeCalculator The change calculator.
     * @param inputArgsArray The input args array.
     *
     * @return The results of the change calculation.
     *
     * @see #runWorkflow(ChangeCalculatorBase, List)
     */
    public final List<CalculateChangeResult> runWorkflow(
            final ChangeCalculatorBase changeCalculator,
            final CalculateChangeArgs... inputArgsArray) {
        if (inputArgsArray == null) {
            throw new InputArgsArrayNullException();
        }
        return this.runWorkflow(changeCalculator, Arrays.asList(inputArgsArray));
    }

    /**
     * Runs a calculate change workflow on a single calculate change args.
     *
     * @param changeCalculator The change calculator.
     * @param inputArgs The input args.
     *
     * @return The result of the change calculation.
     */
    public final CalculateChangeResult runWorkflowSingle(
            final ChangeCalculatorBase changeCalculator,
            final CalculateChangeArgs inputArgs) {
        if (inputArgs == null) {
            throw new InputArgsNullException();
        }
        return this.runWorkflow(changeCalculator, inputArgs).get(0);
    }

    /**
     * See {@link #runWorkflow(Object, InputTranslatorBase, InputParserBase, ChangeCalculatorBase)}
     */
    public static final class TranslationInputNullException extends RuntimeException {
        TranslationInputNullException() {
            super("translation input must not be null");
        }
    }

    /**
     * See {@link #runWorkflow(Object, InputParserBase, ChangeCalculatorBase)}.
     *
     * @see #runWorkflow(Object, InputParserBase, ChangeCalculatorBase)
     */
    public static final class ParserInputNullException extends RuntimeException {
        ParserInputNullException() {
            super("parse input must not be null");
        }
    }

    /**
     * See {@link #runWorkflow(ChangeCalculatorBase, List)}
     *
     * @see #runWorkflow(ChangeCalculatorBase, List)
     */
    public static final class InputArgsListNullException extends RuntimeException {
        InputArgsListNullException() {
            super("input args list must not be null");
        }
    }

    /**
     * See {@link #runWorkflow(ChangeCalculatorBase, List)}
     *
     * @see #runWorkflow(ChangeCalculatorBase, List)
     */
    public static final class ChangeCalculatorNullException extends RuntimeException {
        ChangeCalculatorNullException() {
            super("change calculator must not be null");
        }
    }

    /**
     * See {@link #runWorkflow(ChangeCalculatorBase, List)}
     *
     * @see #runWorkflow(ChangeCalculatorBase, List)
     */
    public static final class InputArgsListEmptyException extends RuntimeException {
        InputArgsListEmptyException() {
            super("input args list must not be empty");
        }
    }

    /**
     * See {@link #runWorkflow(ChangeCalculatorBase, CalculateChangeArgs...)}
     *
     * @see #runWorkflow(ChangeCalculatorBase, CalculateChangeArgs...)
     */
    public static final class InputArgsArrayNullException extends RuntimeException {
        InputArgsArrayNullException() {
            super("input args array must not be null");
        }
    }

    /**
     * See {@link #runWorkflowSingle(ChangeCalculatorBase, CalculateChangeArgs)}
     *
     * @see #runWorkflowSingle(ChangeCalculatorBase, CalculateChangeArgs)
     */
    public static final class InputArgsNullException extends RuntimeException {
        InputArgsNullException() {
            super("input args must not be null");
        }
    }
}
