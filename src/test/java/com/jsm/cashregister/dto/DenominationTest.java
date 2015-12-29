package com.jsm.cashregister.dto;

import java.math.BigDecimal;

import org.junit.Assert;
import org.junit.Test;

public class DenominationTest {
  @Test
  public void getDollarValue() {
    final BigDecimal expected = new BigDecimal("1");
    BigDecimal actual = Denomination.DOLLAR.getValue();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void getDimeValue() {
    final BigDecimal expected = new BigDecimal(".1");
    BigDecimal actual = Denomination.DIME.getValue();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void getNickelValue() {
    final BigDecimal expected = new BigDecimal(".05");
    BigDecimal actual = Denomination.NICKEL.getValue();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void getPennyValue() {
    final BigDecimal expected = new BigDecimal(".01");
    BigDecimal actual = Denomination.PENNY.getValue();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void getQuarterValue() {
    final BigDecimal expected = new BigDecimal(".25");
    BigDecimal actual = Denomination.QUARTER.getValue();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringDollar() {
    final String expected = "dollar";
    String actual = Denomination.DOLLAR.toString();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringDime() {
    final String expected = "dime";
    String actual = Denomination.DIME.toString();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringNickel() {
    final String expected = "nickel";
    String actual = Denomination.NICKEL.toString();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringPenny() {
    final String expected = "penny";
    String actual = Denomination.PENNY.toString();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringQuarter() {
    final String expected = "quarter";
    String actual = Denomination.QUARTER.toString();

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringDollars() {
    final String expected = "dollars";
    String actual = Denomination.DOLLAR.toString(true);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringDimes() {
    final String expected = "dimes";
    String actual = Denomination.DIME.toString(true);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringNickels() {
    final String expected = "nickels";
    String actual = Denomination.NICKEL.toString(true);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringPennies() {
    final String expected = "pennies";
    String actual = Denomination.PENNY.toString(true);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringQuarters() {
    final String expected = "quarters";
    String actual = Denomination.QUARTER.toString(true);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringDollarSingular() {
    final String expected = "dollar";
    String actual = Denomination.DOLLAR.toString(false);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringDimeSingular() {
    final String expected = "dime";
    String actual = Denomination.DIME.toString(false);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringNickelSingular() {
    final String expected = "nickel";
    String actual = Denomination.NICKEL.toString(false);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringPennieSingular() {
    final String expected = "penny";
    String actual = Denomination.PENNY.toString(false);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void toStringQuarterSingular() {
    final String expected = "quarter";
    String actual = Denomination.QUARTER.toString(false);

    Assert.assertEquals(expected, actual);
  }
}
