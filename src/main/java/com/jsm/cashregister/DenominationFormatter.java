package com.jsm.cashregister;

import java.util.Map;

import com.jsm.cashregister.dto.Denomination;

/**
 * Formats the denomination in human readable strings
 * 
 * @author Joshua
 *
 */
public interface DenominationFormatter {
  /**
   * Format given denomination and amount in a human string
   * 
   * @param denomination
   * @param amount amount of denomination given
   * @return string readable form of denomination
   */
  String formatDenomination(Denomination denomination, Integer amount);

  /**
   * Takes a series of denominations and formats them into a sentance like structure
   * 
   * @param denominations
   * @return sentence structure of denominations and amounts given
   */
  String formatDenominations(Map<Denomination, Integer> denominations);
}
