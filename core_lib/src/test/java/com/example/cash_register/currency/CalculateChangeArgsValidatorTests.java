package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.hamcrest.collection.IsEmptyCollection;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Iterator;

import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;
import static com.example.cash_register.CurrencyValueConstantsForTests.EUR_ONE_CENT_COIN_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static com.example.cash_register.shared.exceptions.OnlyOneException.ForCollectionOfThrowable.collectionOfThrowableOnlyOneException;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsInstanceOf.instanceOf;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CalculateChangeArgsValidatorTests {
    @Autowired
    private CalculateChangeArgs.Validator validator;

    @Test
    public void validate_test() {
        final CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(USD_PENNY_VALUE)
                .tendered(USD_NICKEL_VALUE)
                .build();
        this.validator.validate(args);
        MatcherAssert.assertThat(args.getInputArgsExceptionList(), IsEmptyCollection.empty());
    }

    @Test
    public void validate_invalidOwed_test() {
        final CurrencyValue ZERO = CurrencyValue.getZero(USD_CURRENCY);
        final CurrencyValue ONE = CurrencyValue.getOne(USD_CURRENCY);
        final CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(ZERO)
                .tendered(ONE)
                .build();
        this.validator.validate(args);

        MatcherAssert.assertThat(args.isValid(), equalTo(false));
        MatcherAssert.assertThat(args.getInputArgsExceptionList(), hasSize(2));

        final Iterator<Throwable> iterator = args.getInputArgsExceptionList().iterator();
        final Throwable firstException = iterator.next();
        final Throwable secondException = iterator.next();
        MatcherAssert.assertThat(firstException, instanceOf(PhysicalSetMap.CheckRepresentationCalculateChangeArgsOwedException.class));
        MatcherAssert.assertThat(secondException, instanceOf(PhysicalSetMap.CheckRepresentationCurrencyValueNonPositiveException.class));
    }

    @Test
    public void validate_invalidTendered_test() {
        final CurrencyValue ZERO = CurrencyValue.getZero(USD_CURRENCY);
        final CurrencyValue ONE = CurrencyValue.getOne(USD_CURRENCY);
        final CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(ONE)
                .tendered(ZERO)
                .build();
        this.validator.validate(args);

        MatcherAssert.assertThat(args.isValid(), equalTo(false));
        MatcherAssert.assertThat(args.getInputArgsExceptionList(), hasSize(3));

        final Iterator<Throwable> iterator = args.getInputArgsExceptionList().iterator();
        final Throwable firstException = iterator.next();
        final Throwable secondException = iterator.next();
        final Throwable thirdException = iterator.next();
        MatcherAssert.assertThat(firstException, instanceOf(PhysicalSetMap.CheckRepresentationCalculateChangeArgsTenderedException.class));
        MatcherAssert.assertThat(secondException, instanceOf(PhysicalSetMap.CheckRepresentationCurrencyValueNonPositiveException.class));
        MatcherAssert.assertThat(thirdException, instanceOf(CalculateChangeArgs.Validator.TenderedValueLessThanOwedValueException.class));
    }

    @Test(expected = CalculateChangeArgs.Validator.DifferentCurrencyException.class)
    public void validate_DifferentCurrencyException_test() {
        final CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(USD_PENNY_VALUE)
                .tendered(EUR_ONE_CENT_COIN_VALUE)
                .build();
        this.validator.validate(args);
        MatcherAssert.assertThat(
                args.getInputArgsExceptionList(),
                collectionOfThrowableOnlyOneException(CalculateChangeArgs.Validator.DifferentCurrencyException.class));
        throw (CalculateChangeArgs.Validator.DifferentCurrencyException) args.getInputArgsExceptionList().iterator().next();
    }

    @Test(expected = CalculateChangeArgs.Validator.ValidateCalculateChangeArgsNullException.class)
    public void validate_ValidateCalculateChangeArgsNullException_test() {
        this.validator.validate((CalculateChangeArgs) null);
    }

    @Test(expected = CalculateChangeArgs.Validator.TenderedValueLessThanOwedValueException.class)
    public void validate_TenderedValueLessThanOwedValueException_test() {
        final CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(USD_NICKEL_VALUE)
                .tendered(USD_PENNY_VALUE)
                .build();
        this.validator.validate(args);
        MatcherAssert.assertThat(
                args.getInputArgsExceptionList(),
                collectionOfThrowableOnlyOneException(CalculateChangeArgs.Validator.TenderedValueLessThanOwedValueException.class));
        throw (CalculateChangeArgs.Validator.TenderedValueLessThanOwedValueException) args.getInputArgsExceptionList().iterator().next();
    }
}
