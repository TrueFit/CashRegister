package com.jsm.cashregister;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.jsm.cashregister.dto.Denomination;

public class ChangeCreatorImplTest {
  ChangeCreator changeCreator;

  @Before
  public void setup() {
    changeCreator = new ChangeCreatorImpl();
  }

  @Test
  public void sampleOutput1() {
    final BigDecimal cost = new BigDecimal("2.12");
    final BigDecimal paid = new BigDecimal("3.00");
    final Map<Denomination, Integer> expected = new HashMap<>();
    Map<Denomination, Integer> actual;

    expected.put(Denomination.QUARTER, 3);
    expected.put(Denomination.DIME, 1);
    expected.put(Denomination.PENNY, 3);

    actual = changeCreator.createChange(cost, paid);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void sampleOutput2() {
    final BigDecimal cost = new BigDecimal("1.97");
    final BigDecimal paid = new BigDecimal("2.00");
    final Map<Denomination, Integer> expected = new HashMap<>();
    Map<Denomination, Integer> actual;

    expected.put(Denomination.PENNY, 3);

    actual = changeCreator.createChange(cost, paid);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void sampleOutputRandomCheck() {
    final BigDecimal cost = new BigDecimal("3.33");
    final BigDecimal paid = new BigDecimal("5.00");
    Map<Denomination, Integer> output1 = changeCreator.createChange(cost, paid);
    Map<Denomination, Integer> output2 = changeCreator.createChange(cost, paid);

    Assert.assertNotEquals(output1, output2);
  }

  @Test
  public void sampleOutputRandomAmountCheck() {
    final BigDecimal cost = new BigDecimal("3.33");
    final BigDecimal paid = new BigDecimal("5.00");
    final BigDecimal expected = new BigDecimal("1.67");
    final BigDecimal dime = new BigDecimal("0.10");
    final BigDecimal nickel = new BigDecimal("0.05");
    final BigDecimal penny = new BigDecimal("0.01");
    final BigDecimal quarter = new BigDecimal("0.25");
    BigDecimal actual = new BigDecimal("0");
    Map<Denomination, Integer> output;

    output = changeCreator.createChange(cost, paid);

    for (Entry<Denomination, Integer> entry : output.entrySet()) {
      switch (entry.getKey()) {
        case DOLLAR:
          actual = actual.add(new BigDecimal(entry.getValue()));
          break;
        case DIME:
          actual = actual.add(new BigDecimal(entry.getValue()).multiply(dime));
          break;
        case NICKEL:
          actual = actual.add(new BigDecimal(entry.getValue()).multiply(nickel));
          break;
        case PENNY:
          actual = actual.add(new BigDecimal(entry.getValue()).multiply(penny));
          break;
        case QUARTER:
          actual = actual.add(new BigDecimal(entry.getValue()).multiply(quarter));
          break;
      }
    }

    Assert.assertEquals(expected, actual);
  }
}
