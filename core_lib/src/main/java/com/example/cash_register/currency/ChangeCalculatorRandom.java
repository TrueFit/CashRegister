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
     * Physical converter random.
     *
     * @see PhysicalConverterRandom
     */
    @Autowired
    private PhysicalConverterRandom physicalConverter;

    /**
     * Returns the change in a random combination of physical pieces.
     *
     * @param args The calculate change args.
     *
     * @return The calculate change result.
     */
    @Override
    protected CalculateChangeResult calculateImpl(CalculateChangeArgs args) {
        CurrencyValue difference = this.calculateDifference(args);
        SortedBag<PhysicalCurrency> changeBag = this.physicalConverter.convertToPhysicalCurrency(difference);
        CalculateChangeResult result = CalculateChangeResult.successful(args, changeBag);
        return result;
    }
}
