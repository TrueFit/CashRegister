package com.example.cash_register.currency;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collections;
import java.util.Currency;
import java.util.List;

/**
 * This is a model used by Jackson to parse JSON files which populate the global {@link PhysicalSetMap}; this map
 * ultimately determines which physical currencies and physical currencies pieces are supported via this library.
 */
@Getter(AccessLevel.PACKAGE)
@Setter(AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PACKAGE)
final class PhysicalSetConfig {
    /**
     * The currency
     */
    private Currency currency;
    /**
     * The list of unit values and names which make up the physical currency set.
     */
    private List<UnitValueAndName> currencyValues = Collections.emptyList();
}
