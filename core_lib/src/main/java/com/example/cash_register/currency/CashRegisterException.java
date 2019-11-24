package com.example.cash_register.currency;

/**
 * The base class for cash register exceptions.
 */
class CashRegisterException extends RuntimeException {
    CashRegisterException(final String message) {
        super(message);
    }

    CashRegisterException(final String message, final Throwable cause) {
        super(message, cause);
    }
}
