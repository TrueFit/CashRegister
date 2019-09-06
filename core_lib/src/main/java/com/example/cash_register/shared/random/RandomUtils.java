package com.example.cash_register.shared.random;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.concurrent.ThreadLocalRandom;

/**
 * Utilities for returning random elements from arrays.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class RandomUtils {
    /**
     * Static instance.
     */
    @Getter
    private static final RandomUtils instance = new RandomUtils();

    /**
     * Returns a random element from the provided array.
     *
     * @param thisArray The array to use.
     * @param <E> The element type of the array, usually inferred.
     *
     * @return A random element from the provided array.
     *
     * @throws GetRandomElementArrayNullException When the provided array is null.
     * @throws GetRandomElementArrayEmptyException When the provided array is null.
     * @throws GetRandomElementArrayHasSizeOneException When the provided array has size of one.
     */
    public <E> E getRandomElement(final E[] thisArray) {
        if (thisArray == null) {
            throw new GetRandomElementArrayNullException();
        }
        if (thisArray.length == 0) {
            throw new GetRandomElementArrayEmptyException();
        }
        if (thisArray.length == 1) {
            throw new GetRandomElementArrayHasSizeOneException();
        }

        final int bound = thisArray.length;
        final int randomIndex = ThreadLocalRandom.current().nextInt(bound);
        return thisArray[randomIndex];
    }

    /**
     * See {@link #getRandomElement(Object[])}
     *
     * @see #getRandomElement(Object[])
     */
    public static final class GetRandomElementArrayNullException extends NullPointerException {
        private GetRandomElementArrayNullException() {
            super("can not get element from null array");
        }
    }

    /**
     * See {@link #getRandomElement(Object[])}
     *
     * @see #getRandomElement(Object[])
     */
    public static final class GetRandomElementArrayEmptyException extends IllegalArgumentException {
        private GetRandomElementArrayEmptyException() {
            super("can not get element from empty array");
        }
    }

    /**
     * See {@link #getRandomElement(Object[])}
     *
     * @see #getRandomElement(Object[])
     */
    public static final class GetRandomElementArrayHasSizeOneException extends IllegalArgumentException {
        private GetRandomElementArrayHasSizeOneException() {
            super("can not get random element from array with size 1; the same element will always be returned");
        }
    }
}
