package com.example.cash_register.shared.exceptions;

import java.util.Collection;

/**
 * An exception which is made up of multiple exceptions stored in a list.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
public class CompoundException extends RuntimeException {
    /**
     * The exception list.
     */
    private final ExceptionList exceptionList;

    /**
     * Create an {@code ExceptionList} from the given collection.
     *
     * @param throwableCollection The collection to populate this {@code CompoundException}.
     */
    public CompoundException(Collection<Throwable> throwableCollection) {
        this.exceptionList = new ExceptionList();
        this.getExceptionList().addAll(throwableCollection);
    }

    /**
     * The exception collection.
     */
    public ExceptionList getExceptionList() {
        return exceptionList;
    }

    /**
     * {@code .toString()}
     *
     * @return The string.
     */
    @Override
    public String toString() {
        String message = String.format(
                "%s%s  %s",
                super.toString(),
                System.lineSeparator(),
                this.getExceptionList().toString());
        return message;
    }
}
