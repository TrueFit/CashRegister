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
     * See {@link PhysicalConverterMost}.
     */
    @Autowired
    private final PhysicalConverterMost physicalConverterMost;

    /**
     * Autowired constructor.
     *
     * @param physicalConverterMost See {@link PhysicalConverterMost}.
     */
    @Autowired
    private ChangeCalculatorMost(final PhysicalConverterMost physicalConverterMost) {
        this.physicalConverterMost = physicalConverterMost;
    }

    /**
     * Returns the change in the most number of physical pieces.
     *
     * @param args The calculate change args.
     *
     * @return The calculate change result.
     */
    @Override
    protected CalculateChangeResult calculateImpl(final CalculateChangeArgs args) {
        final CurrencyValue difference = this.calculateDifference(args);
        final SortedBag<PhysicalCurrency> changeBag = this.physicalConverterMost.convertToPhysicalCurrency(difference);
        final CalculateChangeResult result = CalculateChangeResult.successful(args, difference, this.getClass(), changeBag);
        return result;
    }
}
