package com.example.cash_register.currency;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Represents a unit value and name for use with physical currency models.
 */
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter(AccessLevel.PACKAGE)
@Setter(AccessLevel.PACKAGE)
@ToString
final class UnitValueAndName {
    /**
     * The name.
     */
    @lombok.NonNull
    private String name;
    /**
     * The unit value.
     */
    @lombok.NonNull
    private UnitValue unitValue;

    /**
     * Check if this unit value is non-positive.
     *
     * @return {@code true} when this unit value is non-positive; otherwise, {@code false}.
     */
    boolean isNonPositive() {
        return this.getUnitValue().isNonPositive();
    }
}
