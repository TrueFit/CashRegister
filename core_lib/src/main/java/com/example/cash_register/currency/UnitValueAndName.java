package com.example.cash_register.currency;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
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
    @NonNull
    private String name;
    /**
     * The unit value.
     */
    @NonNull
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
