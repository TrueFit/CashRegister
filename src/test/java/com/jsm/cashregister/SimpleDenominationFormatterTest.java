package com.jsm.cashregister;

import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.jsm.cashregister.dto.Denomination;


public class SimpleDenominationFormatterTest {
  DenominationFormatter denominationFormatter;

  @Before
  public void before() {
    denominationFormatter = new SimpleDenominationFormatter();
  }

  @Test
  public void denominationFormatterSingularDime() {
    final Denomination denomination = Denomination.DIME;
    final Integer amount = 1;
    final String expected = "1 dime";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterPluralDime() {
    final Denomination denomination = Denomination.DIME;
    final Integer amount = 2;
    final String expected = "2 dimes";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterZeroDimes() {
    final Denomination denomination = Denomination.DIME;
    final Integer amount = 0;
    final String expected = "0 dimes";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterSingularDollar() {
    final Denomination denomination = Denomination.DOLLAR;
    final Integer amount = 1;
    final String expected = "1 dollar";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterPluralDollar() {
    final Denomination denomination = Denomination.DOLLAR;
    final Integer amount = 2;
    final String expected = "2 dollars";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterZeroDollars() {
    final Denomination denomination = Denomination.DOLLAR;
    final Integer amount = 0;
    final String expected = "0 dollars";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterSingularNickel() {
    final Denomination denomination = Denomination.NICKEL;
    final Integer amount = 1;
    final String expected = "1 nickel";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterPluralNickels() {
    final Denomination denomination = Denomination.NICKEL;
    final Integer amount = 2;
    final String expected = "2 nickels";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterZeroNickels() {
    final Denomination denomination = Denomination.NICKEL;
    final Integer amount = 0;
    final String expected = "0 nickels";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterSingularPenny() {
    final Denomination denomination = Denomination.PENNY;
    final Integer amount = 1;
    final String expected = "1 penny";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterPluralPenny() {
    final Denomination denomination = Denomination.PENNY;
    final Integer amount = 2;
    final String expected = "2 pennies";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterZeroPennies() {
    final Denomination denomination = Denomination.PENNY;
    final Integer amount = 0;
    final String expected = "0 pennies";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterSingularQuarter() {
    final Denomination denomination = Denomination.QUARTER;
    final Integer amount = 1;
    final String expected = "1 quarter";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterPluralQuarter() {
    final Denomination denomination = Denomination.QUARTER;
    final Integer amount = 2;
    final String expected = "2 quarters";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void denominationFormatterZeroQuarters() {
    final Denomination denomination = Denomination.QUARTER;
    final Integer amount = 0;
    final String expected = "0 quarters";
    String actual;

    actual = denominationFormatter.formatDenomination(denomination, amount);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void formatDenominations() {
    final Map<Denomination, Integer> denominations = new LinkedHashMap<>();
    final String expected = "1 dollar, 2 quarters, 1 dime, 2 nickels, 4 pennies";
    String actual;

    denominations.put(Denomination.DIME, 1);
    denominations.put(Denomination.DOLLAR, 1);
    denominations.put(Denomination.NICKEL, 2);
    denominations.put(Denomination.PENNY, 4);
    denominations.put(Denomination.QUARTER, 2);

    actual = denominationFormatter.formatDenominations(denominations);

    Assert.assertEquals(expected, actual);
  }
}
