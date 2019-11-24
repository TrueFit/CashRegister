package com.example.cash_register.currency;

import com.example.cash_register.shared.exceptions.CompoundException;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The base class for change calculators, which input calculate change args and output the calculate change result.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component /* abstract */
public abstract class ChangeCalculatorBase {
    /**
     * See {@link CalculateChangeArgs.Validator}
     */
    @Autowired
    private CalculateChangeArgs.Validator validator;

    /**
     * Calculates changes.
     *
     * @param argsList A collection of calculate change args for which to calculate change.
     *
     * @return A list of calculate change results.
     *
     * @see #calculate(CalculateChangeArgs)
     */
    final List<CalculateChangeResult> calculate(final Collection<CalculateChangeArgs> argsList) {
        List<CalculateChangeResult> resultList = argsList
                .parallelStream()
                .map(this::calculate)
                .collect(Collectors.toUnmodifiableList());
        return resultList;
    }

    /**
     * Calculates change.
     *
     * @param args The args for the calculation
     *
     * @return The result of the calculation
     *
     * @see CalculateChangeArgs
     * @see CalculateChangeResult
     */
    final CalculateChangeResult calculate(final CalculateChangeArgs args) {
        this.validator.validate(args);

        CalculateChangeResult results;
        if (args.isValid()) {
            results = this.calculateImpl(args);
        }
        else {
            final CompoundException cause = new CompoundException(args.getInputArgsExceptionList());
            final InvalidCalculateChangeArgsException exception = new InvalidCalculateChangeArgsException(
                    cause);
            final Collection<Throwable> causeList = ExceptionUtils.getThrowableList(exception);
            results = CalculateChangeResult.unsuccessful(args, this.getClass(), causeList);
        }
        return results;
    }

    /**
     * Calculates the difference given the calculate change args.
     *
     * @param args The calculate change args.
     *
     * @return The difference
     *
     * @see CurrencyValue
     */
    protected final CurrencyValue calculateDifference(CalculateChangeArgs args) {
        CurrencyValue owed = args.getOwed();
        CurrencyValue tendered = args.getTendered();
        CurrencyValue difference = tendered.subtract(owed);
        return difference;
    }

    /**
     * Subclasses must override this method, perform an appropriate calculation, and return the result. The args have
     * already been validated via {@link CalculateChangeArgs.Validator#validate(CalculateChangeArgs)} when passed to
     * this method.
     *
     * @param args The calculate change args.
     *
     * @return The result of the calculation.
     *
     * @see CalculateChangeArgs.Validator#validate(CalculateChangeArgs)
     */
    protected abstract CalculateChangeResult calculateImpl(CalculateChangeArgs args);

    /**
     * This exception is placed into the calculate change result object when the args are invalid.
     *
     * @see #calculate(CalculateChangeArgs)
     * @see CalculateChangeResult#getOutputResultExceptionList()
     */
    public static final class InvalidCalculateChangeArgsException extends CashRegisterException {
        InvalidCalculateChangeArgsException(Throwable cause) {
            super("calculate change args are invalid", cause);
        }
    }
}
