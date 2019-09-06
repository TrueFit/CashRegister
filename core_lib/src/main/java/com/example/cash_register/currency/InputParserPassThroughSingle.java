package com.example.cash_register.currency;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * An implementation of an input parser which simply passes through a single calculate change args object without any
 * changes; this is useful for testing.
 *
 * @see InputParserBase
 */
@Component(InputParserPassThroughSingle.QUALIFIER)
public class InputParserPassThroughSingle extends InputParserBase<CalculateChangeArgs> {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.InputParserPassThroughSingle";

    /**
     * Passes through the provided calculate change args.
     *
     * @param calculateChangeArgs The calculate change args to pass through.
     *
     * @return The passed through calculate change args.
     */
    @Override
    protected List<CalculateChangeArgs> parseImpl(CalculateChangeArgs calculateChangeArgs) {
        return Collections.singletonList(calculateChangeArgs);
    }
}
