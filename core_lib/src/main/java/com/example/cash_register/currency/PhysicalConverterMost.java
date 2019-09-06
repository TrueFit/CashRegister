package com.example.cash_register.currency;

import org.apache.commons.collections4.SortedBag;
import org.apache.commons.collections4.bag.TreeBag;
import org.springframework.stereotype.Component;

import java.util.Currency;
import java.util.SortedSet;

/**
 * An implementation of {@link PhysicalConverterBase} which converts a currency value to a physical currency bag using
 * the most pieces of physical currency possible. In practice, this will return a collection of the smallest available
 * physical currency.
 */
@Component(PhysicalConverterMost.QUALIFIER)
public final class PhysicalConverterMost extends PhysicalConverterBase {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.PhysicalConverterMost";

    /**
     * Converts the currency value to the most possible pieces of physical currency.
     *
     * @param currencyValue The currency value to convert.
     *
     * @return The bag of physical currency.
     */
    @Override
    protected SortedBag<PhysicalCurrency> convertToPhysicalCurrencyImpl(final CurrencyValue currencyValue) {
        final SortedBag<PhysicalCurrency> changeBag = new TreeBag<>();
        final Currency currency = currencyValue.getCurrency();

        final SortedSet<PhysicalCurrency> physicalSet = this.getPhysicalSetMap().get(currency);
        /* the last piece in the set is the smallest value */
        final PhysicalCurrency smallestPhysicalCurrency = physicalSet.last();

        CurrencyValue workingValue = CurrencyValue.copy(currencyValue);
        /* subtract the smallest physical currency and put in the change bag, until the working value is zero. */
        while (workingValue.greaterThanZero()) {
            changeBag.add(smallestPhysicalCurrency);
            workingValue = workingValue.subtract(smallestPhysicalCurrency);
        }
        return changeBag;
    }
}
