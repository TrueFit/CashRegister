package com.example.cash_register.currency;

import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.collections4.SortedBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * The base class for converting a currency value into a physical currency bag representation.
 *
 * @see PhysicalConverterRandom
 * @see PhysicalConverterFewest
 * @see PhysicalConverterMost
 */
@Component /* abstract */
public abstract class PhysicalConverterBase {
    /**
     * Physical set map.
     */
    @Autowired
    @Getter(AccessLevel.PROTECTED)
    private PhysicalSetMap physicalSetMap;

    /**
     * Converts the provided currency value into a physical currency representation.
     *
     * @param currencyValue The currency value to convert.
     *
     * @return The bag of physical currency.
     *
     * @see PhysicalSetMap#checkRepresentation(CurrencyValue)
     */
    public final SortedBag<PhysicalCurrency> convertToPhysicalCurrency(final CurrencyValue currencyValue) {
        this.physicalSetMap.checkRepresentation(currencyValue);
        return this.convertToPhysicalCurrencyImpl(currencyValue);
    }

    /**
     * Subclasses must implement this method and convert the currency value into a bag of physical currency; the
     * currency value has already been validated via {@link PhysicalSetMap#checkRepresentation(CurrencyValue)} when
     * passed to this method.
     *
     * @param currencyValue The currency value to convert.
     *
     * @return The bag of physical currency.
     *
     * @see PhysicalSetMap#checkRepresentation(CalculateChangeArgs)
     */
    protected abstract SortedBag<PhysicalCurrency> convertToPhysicalCurrencyImpl(CurrencyValue currencyValue);
}
