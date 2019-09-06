package com.example.tango.lib;

import com.example.cash_register.currency.CalculateChangeArgs;
import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.ChangeCalculatorBase;
import com.example.cash_register.currency.CurrencyValue;
import com.example.cash_register.currency.PhysicalConverterFewest;
import com.example.cash_register.currency.PhysicalConverterRandom;
import com.example.cash_register.currency.PhysicalCurrency;
import org.apache.commons.collections4.SortedBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigInteger;

/**
 * An implementation of a change calculator which will normally return the change in the fewest number of physical
 * pieces, unless the owed amount is divisible by the random change divisor {@link
 * TangoProperties#getRandomChangeDivisor}, in which case, the change will be randomly chosen from the available
 * physical pieces.
 *
 * @see TangoProperties#getRandomChangeDivisor()
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component(TangoChangeCalculator.QUALIFIER)
public final class TangoChangeCalculator extends ChangeCalculatorBase {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.tango.lib.TangoChangeCalculator";

    /**
     * The application properties.
     */
    @Autowired
    private TangoProperties tangoProperties;

    /**
     * The fewest physical pieces converter.
     */
    @Autowired
    private PhysicalConverterFewest physicalConverterFewest;

    /**
     * The random physical pieces converter.
     */
    @Autowired
    private PhysicalConverterRandom physicalConverterRandom;

    /**
     * Returns the change in the fewest number of physical pieces, unless the owed amount is divisible by {@link
     * TangoProperties#getRandomChangeDivisor()}, in which case, the change will be randomly populated.
     *
     * @param args The calculate change args.
     *
     * @return The calculate change result.
     */
    @Override
    protected CalculateChangeResult calculateImpl(CalculateChangeArgs args) {
        CurrencyValue owed = args.getOwed();
        CurrencyValue difference = this.calculateDifference(args);

        SortedBag<PhysicalCurrency> changeBag;
        BigInteger randomChangeDivisor = this.tangoProperties.getRandomChangeDivisor();
        if (owed.isDivisibleBy(randomChangeDivisor)) {
            changeBag = this.physicalConverterRandom.convertToPhysicalCurrency(difference);
        }
        else {
            changeBag = this.physicalConverterFewest.convertToPhysicalCurrency(difference);
        }

        CalculateChangeResult results = CalculateChangeResult.successful(args, changeBag);
        return results;
    }
}
