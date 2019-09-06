package com.example.cash_register.currency;

import org.apache.commons.collections4.SortedBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * An implementation of a change calculator which returns the change in the most number of physical pieces. In practice,
 * this returns change which consists entirely of a collection of the smallest valued physical piece.
 *
 * @see ChangeCalculatorBase
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component(ChangeCalculatorMost.QUALIFIER)
public final class ChangeCalculatorMost extends ChangeCalculatorBase {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.ChangeCalculatorMost";
    /**
     * Physical converter most
     *
     * @see PhysicalConverterMost
     */
    @Autowired
    private PhysicalConverterMost physicalConverter;

    /**
     * Returns the change in the most number of physical pieces.
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
