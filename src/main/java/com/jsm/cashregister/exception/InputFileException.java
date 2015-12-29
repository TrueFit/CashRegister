package com.jsm.cashregister.exception;

public class InputFileException extends RuntimeException {
  private static final long serialVersionUID = 1853981948814621777L;

  public InputFileException() {
    super();
  }

  public InputFileException(String arg0, Throwable arg1, boolean arg2, boolean arg3) {
    super(arg0, arg1, arg2, arg3);
  }

  public InputFileException(String arg0, Throwable arg1) {
    super(arg0, arg1);
  }

  public InputFileException(String arg0) {
    super(arg0);
  }

  public InputFileException(Throwable arg0) {
    super(arg0);
  }

}
