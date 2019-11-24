package com.example.repl.lib;

import com.example.cash_register.currency.ChangeCalculatorBase;
import com.example.cash_register.currency.ChangeCalculatorFewest;
import com.example.cash_register.currency.ChangeCalculatorMost;
import com.example.cash_register.currency.ChangeCalculatorRandom;
import com.example.tango.lib.TangoChangeCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Calculator utilities, primarily focused on converting to and from {@link CalculatorUtils.CalculatorType} for use with
 * the REPL workflow runner.
 */
@Component(CalculatorUtils.QUALIFIER)
class CalculatorUtils {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.repl.lib.CalculatorUtils";
    /**
     * See {@link ChangeCalculatorFewest}
     */
    private final ChangeCalculatorFewest changeCalculatorFewest;
    /**
     * See {@link ChangeCalculatorRandom}
     */
    private final ChangeCalculatorRandom changeCalculatorRandom;
    /**
     * See {@link ChangeCalculatorMost}
     */
    private final ChangeCalculatorMost changeCalculatorMost;
    /**
     * See {@link TangoChangeCalculator}
     */
    private final TangoChangeCalculator changeCalculatorTango;

    /**
     * Autowired constructor
     *
     * @param changeCalculatorFewest See {@link ChangeCalculatorFewest}
     * @param changeCalculatorRandom See {@link ChangeCalculatorRandom}
     * @param changeCalculatorMost See {@link ChangeCalculatorMost}
     * @param changeCalculatorTango See {@link TangoChangeCalculator}
     */
    @Autowired
    public CalculatorUtils(
            final ChangeCalculatorFewest changeCalculatorFewest,
            final ChangeCalculatorRandom changeCalculatorRandom,
            final ChangeCalculatorMost changeCalculatorMost,
            final TangoChangeCalculator changeCalculatorTango) {
        this.changeCalculatorFewest = changeCalculatorFewest;
        this.changeCalculatorRandom = changeCalculatorRandom;
        this.changeCalculatorMost = changeCalculatorMost;
        this.changeCalculatorTango = changeCalculatorTango;
    }

    /**
     * Returns the calculator which is represented by the given calculator type.
     *
     * @param calculatorType The calculator type.
     *
     * @return The {@link ChangeCalculatorBase} object which is of the appropriate type.
     */
    ChangeCalculatorBase getChangeCalculator(final CalculatorType calculatorType) {
        switch (calculatorType) {
            case MOST: {
                return this.changeCalculatorMost;
            }
            case RANDOM: {
                return this.changeCalculatorRandom;
            }
            case TANGO: {
                return this.changeCalculatorTango;
            }
            case FEWEST:
            default: {
                return this.changeCalculatorFewest;
            }
        }
    }

    /**
     * Returns the calculator type which represents the given calculator.
     *
     * @param calculator The calculator.
     *
     * @return The {@link CalculatorType} which represents the given calculator.
     *
     * @throws CalculateTypeNotFoundException When the calculator type is not found.
     */
    CalculatorType getCalculatorType(final ChangeCalculatorBase calculator) {
        if (calculator instanceof ChangeCalculatorFewest) {
            return CalculatorType.FEWEST;
        }
        else if (calculator instanceof ChangeCalculatorRandom) {
            return CalculatorType.RANDOM;
        }
        else if (calculator instanceof TangoChangeCalculator) {
            return CalculatorType.TANGO;
        }
        else if (calculator instanceof ChangeCalculatorMost) {
            return CalculatorType.MOST;
        }

        throw new CalculateTypeNotFoundException();
    }

    /**
     * An enum containing the types of calculators available.
     */
    enum CalculatorType {
        /**
         * See {@link ChangeCalculatorFewest}
         */
        FEWEST,
        /**
         * See {@link ChangeCalculatorMost}
         */
        MOST,
        /**
         * See {@link ChangeCalculatorRandom}
         */
        RANDOM,
        /**
         * See {@link TangoChangeCalculator}
         */
        TANGO,
        ;
    }

    /**
     * See {@link #getCalculatorType(ChangeCalculatorBase)}
     *
     * @see #getCalculatorType(ChangeCalculatorBase)
     */
    static final class CalculateTypeNotFoundException extends RuntimeException {
        CalculateTypeNotFoundException() {
            super("the calculator is not found in the calculator type enum");
        }
    }
}
