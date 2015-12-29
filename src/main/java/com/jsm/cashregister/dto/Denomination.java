package com.jsm.cashregister.dto;

import java.math.BigDecimal;

public enum Denomination {
  DOLLAR, QUARTER, DIME, NICKEL, PENNY;

  @Override
  public String toString() {
    // only capitalize the first letter
    String s = super.toString();
    return s.toLowerCase();
  }

  public String toString(Boolean plural) {
    String output;

    if (plural) {
      output = this.pluralString();
    } else {
      output = this.toString();
    }

    return output;
  }

  private String pluralString() {
    String output;

    if (this.equals(Denomination.PENNY)) {
      output = "pennies";
    } else {
      output = this.toString() + "s";
    }

    return output;
  }

  public BigDecimal getValue() {
    BigDecimal output = null;

    switch (this) {
      case DOLLAR:
        output = new BigDecimal("1");
        break;
      case QUARTER:
        output = new BigDecimal(".25");
        break;
      case DIME:
        output = new BigDecimal(".1");
        break;
      case NICKEL:
        output = new BigDecimal(".05");
        break;
      case PENNY:
        output = new BigDecimal(".01");
        break;
      default:
        break;
    }

    return output;
  }
}
