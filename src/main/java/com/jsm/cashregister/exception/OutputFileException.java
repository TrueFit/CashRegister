package com.jsm.cashregister.exception;

public class OutputFileException extends RuntimeException {
  private static final long serialVersionUID = 2748986737501565402L;

  public OutputFileException() {
    super();
  }

  public OutputFileException(String message, Throwable cause, boolean enableSuppression,
      boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }

  public OutputFileException(String message, Throwable cause) {
    super(message, cause);
  }

  public OutputFileException(String message) {
    super(message);
  }

  public OutputFileException(Throwable cause) {
    super(cause);
  }

}
