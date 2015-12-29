package com.jsm.cashregister;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.jsm.cashregister.dto.Denomination;

/**
 * Creates a basic format of # denomination name, with a sort order of dollar, quarter, dime,
 * nickel, penny
 * 
 * @author Joshua
 *
 */
public class SimpleDenominationFormatter implements DenominationFormatter {
  private static final List<Denomination> DENOMINATION_SORT_ORDER =
      Arrays.asList(Denomination.DOLLAR, Denomination.QUARTER, Denomination.DIME,
          Denomination.NICKEL, Denomination.PENNY);

  public SimpleDenominationFormatter() {
    super();
  }

  @Override
  public String formatDenomination(Denomination denomination, Integer amount) {
    String output;
    StringBuilder sb = new StringBuilder();
    Boolean plural = false;

    if (amount > 1 || amount == 0) {
      plural = true;
    }

    sb.append(amount.toString());
    sb.append(" ");
    sb.append(denomination.toString(plural));

    output = sb.toString();

    return output;
  }

  @Override
  public String formatDenominations(Map<Denomination, Integer> denominations) {
    String output;
    StringBuilder sb = new StringBuilder();
    Boolean first = true;

    for (Denomination denomination : DENOMINATION_SORT_ORDER) {
      if (denominations.containsKey(denomination)) {
        if (!first) {
          sb.append(", ");
        } else {
          first = false;
        }

        sb.append(this.formatDenomination(denomination, denominations.get(denomination)));
      }
    }

    output = sb.toString();

    return output;
  }

}
