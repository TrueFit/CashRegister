package com.example.cash_register.currency;

import org.apache.commons.collections4.SortedBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * An implementation of a change calculator which returns the change with a random number of physical pieces.
 *
 * @see ChangeCalculatorBase
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component(ChangeCalculatorRandom.QUALIFIER)
public final class ChangeCalculatorRandom extends ChangeCalculatorBase {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.ChangeCalculatorRandom";
    /**
     * See {@link PhysicalConverterRandom}.
     */
    private final PhysicalConverterRandom physicalConverterRandom;

    /**
     * Autowired constructor.
     *
     * @param physicalConverterRandom See {@link PhysicalConverterRandom}.
     */
    @Autowired
    public ChangeCalculatorRandom(final PhysicalConverterRandom physicalConverterRandom) {
        this.physicalConverterRandom = physicalConverterRandom;
    }

    /**
     * Returns the change in a random combination of physical pieces.
     *
     * @param args The calculate change args.
     *
     * @return The calculate change result.
     */
    @Override
    protected CalculateChangeResult calculateImpl(final CalculateChangeArgs args) {
        final CurrencyValue difference = this.calculateDifference(args);
        final SortedBag<PhysicalCurrency> changeBag = this.physicalConverterRandom.convertToPhysicalCurrency(difference);
        final CalculateChangeResult result = CalculateChangeResult.successful(args, difference, this.getClass(), changeBag);
        return result;
    }
}
