package com.example.cash_register.currency;

import org.springframework.stereotype.Component;

/**
 * Takes a calculate change args object and passes it through unchanged.
 */
@Component(InputTranslatorPassThroughSingle.QUALIFIER)
public class InputTranslatorPassThroughSingle extends InputTranslatorBase<CalculateChangeArgs, CalculateChangeArgs> {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.InputTranslatorPassThroughSingle";

    /**
     * Passes through the calculate change args.
     *
     * @param item The calculate change args to pass through.
     *
     * @return The passed through calculate change args.
     */
    @Override
    protected CalculateChangeArgs translateImpl(final CalculateChangeArgs item) {
        return item;
    }
}
