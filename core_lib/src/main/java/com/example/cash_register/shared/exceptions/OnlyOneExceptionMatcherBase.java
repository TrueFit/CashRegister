package com.example.cash_register.shared.exceptions;

import lombok.AccessLevel;
import lombok.Getter;
import org.hamcrest.TypeSafeMatcher;

import java.util.Collection;

/**
 * Base class for "only one exception" matchers, which check collections of {@link Throwable} objects to ensure that
 * only one exception exists in the collection and it matches the expected exception type; used for testing.
 *
 * @param <T> The type of object passed to this matcher, extends {@link Throwable}
 */
abstract class OnlyOneExceptionMatcherBase<T> extends TypeSafeMatcher<T> {
    /**
     * The expected exception type to match.
     */
    @Getter(AccessLevel.PACKAGE)
    private final Class<? extends Throwable> expectedExceptionClass;

    /**
     * Constructor which takes the expected exception class.
     *
     * @param expectedExceptionClass The expected exception class.
     */
    OnlyOneExceptionMatcherBase(Class<? extends Throwable> expectedExceptionClass) {
        this.expectedExceptionClass = expectedExceptionClass;
    }

    /**
     * Implements the {@link TypeSafeMatcher#matchesSafely(Object)} method by calling {@link
     * #extractCollectionOfThrowable(Object)} and testing the returned collection to ensure it has size 1, and the
     * exception which it contains is of type {@link #expectedExceptionClass}.
     *
     * @param item The item passed to this matcher.
     *
     * @return {@code true} when item matches; otherwise, {@code false}.
     */
    @Override
    protected boolean matchesSafely(T item) {
        Collection<Throwable> collectionOfThrowable = this.extractCollectionOfThrowable(item);
        if (collectionOfThrowable.size() != 1) {
            return false;
        }

        Throwable exception = collectionOfThrowable.iterator().next();
        return this.getExpectedExceptionClass().isInstance(exception);
    }

    /**
     * Subclasses must implement this method and return a {@link Collection<Throwable>} from the passed item.
     *
     * @param item The item passed to this matcher, from which a {@link Collection<Throwable>} can be extracted.
     *
     * @return The extracted {@link Collection<Throwable>}.
     */
    protected abstract Collection<Throwable> extractCollectionOfThrowable(T item);
}
