package com.jsm.cashregister;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import com.jsm.cashregister.dto.Denomination;

/**
 * Implements interface to return the minimum amount of physical change, but when amount "owed" is
 * divisible by three return a random set of currencies
 * 
 * @author Joshua
 *
 */
public class ChangeCreatorImpl implements ChangeCreator {
  private static final BigDecimal ZERO = new BigDecimal("0");
  private static final BigDecimal THREE = new BigDecimal("3");
  private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");

  public ChangeCreatorImpl() {
    super();
  }

  /**
   * Create the least amount of change unless amount "owed" is divisible by three then return a
   * random selection
   */
  @Override
  public Map<Denomination, Integer> createChange(BigDecimal cost, BigDecimal paid) {
    EnumMap<Denomination, Integer> output;
    BigDecimal changeToMake = paid.subtract(cost);

    BigDecimal val = cost.multiply(ChangeCreatorImpl.ONE_HUNDRED);
    BigDecimal remainder = val.remainder(ChangeCreatorImpl.THREE);

    if (remainder.compareTo(ChangeCreatorImpl.ZERO) == 0) {
      output = this.createRandomChange(changeToMake);
    } else {
      output = this.createSmallestChange(changeToMake);
    }

    return output;
  }

  /**
   * Creates a random selection of denominations for change
   * 
   * @param changeToMake the amount of change needed
   * @return map of amount with matching denomination
   */
  private EnumMap<Denomination, Integer> createRandomChange(BigDecimal changeToMake) {
    EnumMap<Denomination, Integer> output;
    List<Denomination> denominations = ChangeCreatorImpl.generateRandomList();

    output = this.makeChange(denominations, changeToMake);

    return output;
  }

  /**
   * Creates a random list of currencies order to make change with
   * 
   * @return random list of currency in order to process
   */
  private static List<Denomination> generateRandomList() {
    List<Denomination> output = new ArrayList<>();
    Denomination[] denominations = Denomination.values();

    // create random order
    while (output.size() != 5) {
      SecureRandom random = new SecureRandom();
      Denomination denomination = denominations[random.nextInt(5)];

      if (!output.contains(denomination)) {
        output.add(denomination);
      }
    }

    return output;
  }

  /**
   * Get a list of ordered denominations to generate the least amount of change items
   * 
   * @return List of ordered denominations to process change
   */
  private static List<Denomination> generateLargestToSmallestList() {
    List<Denomination> output = new ArrayList<>();

    output.add(Denomination.DOLLAR);
    output.add(Denomination.QUARTER);
    output.add(Denomination.DIME);
    output.add(Denomination.NICKEL);
    output.add(Denomination.PENNY);

    return output;
  }

  /**
   * creates change with the smallest amount of denominations
   * 
   * @param changeToMake the amount of change required
   * @return map of amount with matching denomination
   */
  private EnumMap<Denomination, Integer> createSmallestChange(BigDecimal changeToMake) {
    EnumMap<Denomination, Integer> output;
    List<Denomination> denominations = ChangeCreatorImpl.generateLargestToSmallestList();

    output = this.makeChange(denominations, changeToMake);

    return output;
  }

  /**
   * Make change based on the ordered denominations list
   * 
   * @param denominations ordered list of denominations to use to make change
   * @param changeToMake the amount of change to make
   * @return a map with denomination and amounts to make given change
   */
  private EnumMap<Denomination, Integer> makeChange(List<Denomination> denominations,
      BigDecimal changeToMake) {
    EnumMap<Denomination, Integer> output = new EnumMap<>(Denomination.class);
    BigDecimal changeLeft = changeToMake;

    for (Denomination denomination : denominations) {
      changeLeft = makeChangeForDenomination(changeLeft, output, denomination);
    }

    return output;
  }

  /**
   * make change for the given criteria
   * 
   * @param changeToMake the amount of change needed
   * @param output the output to add the denomination value to
   * @param denomination the denomination to evaluate for the change needed
   * @return the amount of remaining change needed after evaluate this denomination
   */
  private static BigDecimal makeChangeForDenomination(BigDecimal changeToMake,
      Map<Denomination, Integer> output, Denomination denomination) {
    // see if divides evenly
    BigDecimal denominationValue = denomination.getValue();
    BigDecimal[] division = changeToMake.divideAndRemainder(denominationValue);

    if (ChangeCreatorImpl.ZERO.compareTo(division[0]) != 0) {
      output.put(denomination, division[0].intValueExact());
    }

    BigDecimal changeAmount = division[0].multiply(denominationValue);

    // subtract
    return changeToMake.subtract(changeAmount);
  }
}
