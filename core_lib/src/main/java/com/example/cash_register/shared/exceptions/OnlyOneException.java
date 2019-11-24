package com.example.cash_register.shared.exceptions;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.hamcrest.Description;
import org.hamcrest.MatcherAssert;
import org.hamcrest.TypeSafeMatcher;

import java.util.Collection;

/**
 * Container class for custom Hamcrest matchers related to {@link CompoundException} and {@link ExceptionList}.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class OnlyOneException {
    /**
     * Matcher which checks a {@link CompoundException} to ensure it contains only one exception and that the exception
     * is of the expected type; used for testing..
     */
    public final static class ForCompoundException extends OnlyOneExceptionMatcherBase<CompoundException> {
        /**
         * Constructor which takes the expected exception class.
         *
         * @param expectedExceptionClass The expected exception class.
         */
        private ForCompoundException(final Class<? extends Throwable> expectedExceptionClass) {
            super(expectedExceptionClass);
        }

        /**
         * Static matcher creator for use with {@link MatcherAssert}.
         *
         * @param exceptionClass The expected exception class.
         *
         * @return The {@link ForCompoundException} matcher.
         */
        public static ForCompoundException compoundExceptionOnlyOneException(final Class<? extends Throwable> exceptionClass) {
            return new ForCompoundException(exceptionClass);
        }


        /**
         * Implements the {@link OnlyOneExceptionMatcherBase#extractCollectionOfThrowable(Object)} method to return a
         * {@code Collection<Throwable>} from the {@link CompoundException} via {@link
         * CompoundException#getExceptionList()}.
         *
         * @param item The {@link CompoundException} passed to this matcher.
         *
         * @return The collection of {@link Throwable} objects via {@link CompoundException#getExceptionList()}
         *
         * @see CompoundException
         * @see CompoundException#getExceptionList()
         */
        @Override
        protected Collection<Throwable> extractCollectionOfThrowable(final CompoundException item) {
            return item.getExceptionList();
        }

        /**
         * Implements {@link TypeSafeMatcher#describeTo(Description)} to provide a description on failure to match.
         *
         * @param description The description object.
         */
        @Override
        public void describeTo(final Description description) {
            description
                    .appendText("CompoundException contains only one exception, and the exception is of type ")
                    .appendValue(this.getExpectedExceptionClass());
        }
    }

    /**
     * Matcher which checks a {@code Collection<Throwable>} to ensure it contains only one exception and that the
     * exception is of the expected type; used for testing.
     */
    public final static class ForCollectionOfThrowable extends OnlyOneExceptionMatcherBase<Collection<Throwable>> {
        /**
         * Constructor which takes the expected exception class.
         *
         * @param expectedExceptionClass The expected exception class.
         */
        ForCollectionOfThrowable(final Class<? extends Throwable> expectedExceptionClass) {
            super(expectedExceptionClass);
        }

        /**
         * Static matcher creator for use with {@link MatcherAssert}.
         *
         * @param exceptionClass The expected exception class.
         *
         * @return The {@link ForCollectionOfThrowable} matcher.
         */
        public static ForCollectionOfThrowable collectionOfThrowableOnlyOneException(final Class<? extends Throwable> exceptionClass) {
            return new ForCollectionOfThrowable(exceptionClass);
        }

        /**
         * Implements the {@link OnlyOneExceptionMatcherBase#extractCollectionOfThrowable(Object)} method to return a
         * {@code Collection<Throwable>} by passing through the collection passed to it.
         *
         * @param item The {@code Collection<Throwable>} passed to this matcher.
         *
         * @return The passed through collection of {@link Throwable} objects.
         */
        @Override
        protected Collection<Throwable> extractCollectionOfThrowable(final Collection<Throwable> item) {
            return item;
        }

        /**
         * Implements {@link TypeSafeMatcher#describeTo(Description)} to provide a description on failure to match.
         *
         * @param description The description object.
         */
        @Override
        public void describeTo(final Description description) {
            description
                    .appendText("Collection<Throwable> contains only one exception, and the exception is of type ")
                    .appendValue(this.getExpectedExceptionClass());
        }
    }
}
