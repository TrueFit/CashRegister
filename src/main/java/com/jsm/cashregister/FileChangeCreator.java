package com.jsm.cashregister;

/**
 * Used to provide file I/O for change creation
 * 
 * @author Joshua
 * @Fun
 */
@FunctionalInterface
public interface FileChangeCreator {
  /**
   * Provide the ability to read in a given file and output to a given file
   * 
   * @param inputFilePath file path to read from
   * @param outputFilePath file path to write to
   */
  public void createChange(String inputFilePath, String outputFilePath);
}
