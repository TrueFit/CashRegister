package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import com.example.cash_register.shared.exceptions.CompoundException;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Currency;

import static com.example.cash_register.CurrencyConstantsForTests.USD_CURRENCY;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static com.example.cash_register.shared.exceptions.OnlyOneException.ForCompoundException.compoundExceptionOnlyOneException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class PhysicalSetMapTests {
    @Autowired
    private PhysicalSetMap physicalSetMap;

    @Test
    public void checkRepresentation_withCurrencyValue_test() {
        this.physicalSetMap.checkRepresentation(USD_PENNY_VALUE);
    }

    @Test(expected = PhysicalSetMap.CheckRepresentationCurrencyValueNotDivisibleBySmallestAvailablePhysicalCurrencyException.class)
    public void checkRepresentation_withCurrencyValue_CheckRepresentationCurrencyValueNotDivisibleBySmallestAvailablePhysicalCurrencyException_test() {
        CurrencyValue currencyValue = CurrencyValue.builder()
                .currencyCode("FJD")
                .unitValueAsLong(13)
                .build();
        this.physicalSetMap.checkRepresentation(currencyValue);
    }

    @Test(expected = PhysicalSetMap.CheckRepresentationNullCurrencyException.class)
    public void checkRepresentation_withCurrency_CheckRepresentationNullCurrencyException_test() {
        this.physicalSetMap.checkRepresentation((Currency) null);
    }

    @Test(expected = PhysicalSetMap.CheckRepresentationNullCurrencyValueException.class)
    public void checkRepresentation_withCurrencyValue_CheckRepresentationNullCurrencyValueException_test() {
        this.physicalSetMap.checkRepresentation((CurrencyValue) null);
    }

    @Test(expected = PhysicalSetMap.CheckRepresentationCurrencyKeyNotPresentException.class)
    public void checkRepresentation_withCurrency_CheckRepresentationCurrencyKeyNotPresentException_test() {
        this.physicalSetMap.checkRepresentation(CurrencyConstants.INVALID_CURRENCY);
    }

    @Test
    public void checkRepresentation_withCalculateChangeArgs_test() {
        CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(USD_PENNY_VALUE)
                .tendered(USD_NICKEL_VALUE)
                .build();
        this.physicalSetMap.checkRepresentation(args);
    }

    @Test(expected = PhysicalSetMap.CheckRepresentationNullCalculateChangeArgsException.class)
    public void checkRepresentation_withCalculateChangeArgs_CheckRepresentationNullCalculateChangeArgsException_test() {
        this.physicalSetMap.checkRepresentation((CalculateChangeArgs) null);
    }

    @Test(expected = PhysicalSetMap.CheckRepresentationCalculateChangeArgsOwedException.class)
    public void checkRepresentation_withCalculateChangeArgs_CheckRepresentationCalculateChangeArgsOwedException_test() {
        CurrencyValue owed = CurrencyValue.getZero(USD_CURRENCY);
        CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(owed)
                .tendered(USD_PENNY_VALUE)
                .build();
        try {
            this.physicalSetMap.checkRepresentation(args);
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(compoundException, compoundExceptionOnlyOneException(
                    PhysicalSetMap.CheckRepresentationCalculateChangeArgsOwedException.class));
            final Throwable throwable = compoundException.getExceptionList().iterator().next();
            throw (PhysicalSetMap.CheckRepresentationCalculateChangeArgsOwedException) throwable;
        }
    }

    @Test(expected = PhysicalSetMap.CheckRepresentationCalculateChangeArgsTenderedException.class)
    public void checkRepresentation_withCalculateChangeArgs_CheckRepresentationCalculateChangeArgsTenderedException_test() {
        CurrencyValue tendered = CurrencyValue.getZero(USD_CURRENCY);
        CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(USD_PENNY_VALUE)
                .tendered(tendered)
                .build();
        try {
            this.physicalSetMap.checkRepresentation(args);
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(compoundException, compoundExceptionOnlyOneException(
                    PhysicalSetMap.CheckRepresentationCalculateChangeArgsTenderedException.class));
            Throwable throwable = compoundException.getExceptionList().iterator().next();
            throw (PhysicalSetMap.CheckRepresentationCalculateChangeArgsTenderedException) throwable;
        }
    }
}
