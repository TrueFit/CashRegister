package com.jsm.cashregister;

import java.math.BigDecimal;
import java.util.Map;

import com.jsm.cashregister.dto.Denomination;

/**
 * Creates change for a given purchase
 * 
 * @author Joshua
 *
 */
@FunctionalInterface
public interface ChangeCreator {
  /**
   * Create change denominations for given cost and amount given
   * 
   * @param cost cost of items to purchase
   * @param paid the amount given my purchaser
   * @return Denomination of currency to make up change needed
   */
  public Map<Denomination, Integer> createChange(BigDecimal cost, BigDecimal paid);
}
