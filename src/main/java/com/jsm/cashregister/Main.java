package com.jsm.cashregister;

public class Main {
  public static void main(String[] args) {
    if (args.length == 2) {
      ChangeCreator changeCreator = new ChangeCreatorImpl();
      DenominationFormatter denominationFormatter = new SimpleDenominationFormatter();
      FileChangeCreator fileChangeCreator =
          new FileChangeCreatorImpl(changeCreator, denominationFormatter);

      fileChangeCreator.createChange(args[0], args[1]);
    } else {
      System.err.println("Two arguments required (ex. cashregister input.csv output.txt)");
    }
  }
}
