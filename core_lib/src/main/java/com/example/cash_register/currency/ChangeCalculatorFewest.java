package com.example.cash_register.currency;

import org.apache.commons.collections4.SortedBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * An implementation of a change calculator which returns the change in the fewest number of physical pieces.
 *
 * @see ChangeCalculatorBase
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component(ChangeCalculatorFewest.QUALIFIER)
public final class ChangeCalculatorFewest extends ChangeCalculatorBase {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.ChangeCalculatorFewest";
    /**
     * See {@link PhysicalConverterFewest}.
     */
    @Autowired
    private final PhysicalConverterFewest physicalConverterFewest;

    /**
     * Autowired constructor.
     *
     * @param physicalConverterFewest See {@link PhysicalConverterFewest}.
     */
    @Autowired
    private ChangeCalculatorFewest(final PhysicalConverterFewest physicalConverterFewest) {
        this.physicalConverterFewest = physicalConverterFewest;
    }

    /**
     * Returns the change in the fewest number of physical pieces.
     *
     * @param args The calculate change args.
     *
     * @return The calculate change result.
     */
    @Override
    protected CalculateChangeResult calculateImpl(final CalculateChangeArgs args) {
        final CurrencyValue difference = this.calculateDifference(args);
        final SortedBag<PhysicalCurrency> changeBag = this.physicalConverterFewest.convertToPhysicalCurrency(difference);
        final CalculateChangeResult result = CalculateChangeResult.successful(args, difference, this.getClass(), changeBag);
        return result;
    }
}
