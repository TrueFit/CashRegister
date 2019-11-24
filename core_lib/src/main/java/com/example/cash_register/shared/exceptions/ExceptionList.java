package com.example.cash_register.shared.exceptions;

import org.apache.commons.collections4.list.AbstractListDecorator;
import org.apache.commons.text.TextStringBuilder;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * A specialized list of {@link Throwable} objects.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
public class ExceptionList extends AbstractListDecorator<Throwable> {
    /**
     * The decorated delegate for this {@link AbstractListDecorator}.
     */
    private final List<Throwable> decorated;

    /**
     * Default constructor.
     */
    public ExceptionList() {
        super();
        this.decorated = new ArrayList<>();
    }

    /**
     * Constructor which populates this list with the provided collection.
     *
     * @param throwableCollection The collection to populate this list.
     */
    public ExceptionList(final Collection<Throwable> throwableCollection) {
        this();
        this.decorated.addAll(throwableCollection);
    }

    /**
     * Checks to see if any exceptions are in this list; if so, create and throw a {@link CompoundException} using this
     * list.
     *
     * @see CompoundException
     */
    public final void checkAndThrow() {
        if (! this.isEmpty()) {
            throw new CompoundException(this);
        }
    }

    /**
     * Implementation of {@link AbstractListDecorator#decorated()}.
     *
     * @return This decorated delegate.
     */
    @Override
    protected List<Throwable> decorated() {
        return this.decorated;
    }

    /**
     * {@code .toString()}
     *
     * @return The string.
     */
    @Override
    public String toString() {
        final TextStringBuilder textStringBuilder = new TextStringBuilder();
        for (Throwable exception : this) {
            textStringBuilder.append("    ").appendln(exception);
        }
        final String message = String.format(
                "%s%s%s",
                this.getClass().getName(),
                System.lineSeparator(),
                textStringBuilder.build());
        return message;
    }
}
