package com.example.cash_register.currency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * The base class for input parsers, which take an arbitrary input translated via an {@link InputTranslatorBase} object
 * and parses it to a list of calculate change args objects.
 *
 * @param <TInput> The input type.
 *
 * @see InputParserPassThroughSingle
 * @see InputStreamParserBase
 * @see CalculateChangeArgs.InputModelParser
 */
@Component /* abstract */
public abstract class InputParserBase<TInput> {
    @Autowired
    private CalculateChangeArgs.Validator validator;

    protected InputParserBase() {
        super();
    }

    /**
     * This method takes the input from a {@link InputTranslatorBase} object and parses it into a list of calculate
     * change args object.
     *
     * @param input The input to parse.
     *
     * @return A list of calculate change args objects.
     */
    final List<CalculateChangeArgs> parse(TInput input) {
        List<CalculateChangeArgs> calculateChangeArgsList = this.parseImpl(input);
        this.validator.validate(calculateChangeArgsList);
        return calculateChangeArgsList;
    }

    /**
     * Subclasses must override this method, perform an appropriate parse, and return the list of calculate change
     * args.
     *
     * @param input The input.
     *
     * @return A list of calculate change args suitable to be passed to a {@link ChangeCalculatorBase} object.
     */
    protected abstract List<CalculateChangeArgs> parseImpl(TInput input);
}
