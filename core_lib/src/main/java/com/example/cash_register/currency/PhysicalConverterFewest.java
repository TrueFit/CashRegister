package com.example.cash_register.currency;

import org.apache.commons.collections4.SortedBag;
import org.apache.commons.collections4.bag.TreeBag;
import org.springframework.stereotype.Component;

import java.util.Currency;
import java.util.Iterator;
import java.util.SortedSet;

/**
 * An implementation of {@link PhysicalConverterBase} which converts a currency value to a physical currency bag using
 * the fewest pieces of physical currency possible.
 */
@Component(PhysicalConverterFewest.QUALIFIER)
public final class PhysicalConverterFewest extends PhysicalConverterBase {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.PhysicalConverterFewest";

    /**
     * Converts the currency value to the fewest possible pieces of physical currency.
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
        final Iterator<PhysicalCurrency> physicalSetIterator = physicalSet.iterator();

        CurrencyValue workingValue = currencyValue;
        while (workingValue.greaterThanZero()) {
            /* physical currency sorts from largest value to smallest value */
            final PhysicalCurrency currentPhysicalCurrency = physicalSetIterator.next();
            while (workingValue.greaterThanOrEqualTo(currentPhysicalCurrency)) {
                /* stick a piece of physical currency in the bag, subtract from the working value, and loop */
                changeBag.add(currentPhysicalCurrency);
                workingValue = workingValue.subtract(currentPhysicalCurrency);
            }
        }
        return changeBag;
    }
}
