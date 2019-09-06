package com.example.cash_register.currency;

/**
 * The base class for cash register exceptions.
 */
class CashRegisterException extends RuntimeException {
    CashRegisterException(String message) {
        super(message);
    }

    CashRegisterException(String message, Throwable cause) {
        super(message, cause);
    }
}
