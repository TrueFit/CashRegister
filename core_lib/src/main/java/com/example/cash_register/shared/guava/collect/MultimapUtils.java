package com.example.cash_register.shared.guava.collect;

import com.google.common.collect.ImmutableMultimap;
import com.google.common.collect.Multimap;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * Utilities for Guava {@link Multimap}.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class MultimapUtils {
    /**
     * Filters and returns an immutable multimap which contains only keys (and values) for keys which have more than one
     * value.
     *
     * @param input The multimap to filter.
     * @param <TKey> The key type for the multimap.
     * @param <TValue> The value type for the multimap.
     *
     * @return A filtered multimap, which contains only those keys (and values) for keys which have more than one value.
     */
    public static <TKey, TValue> ImmutableMultimap<TKey, TValue> filterKeysWithMoreThanOneValue(
            final Multimap<TKey, TValue> input) {
        final ImmutableMultimap.Builder<TKey, TValue> builder = ImmutableMultimap.builder();
        input.asMap()
                .entrySet()
                .parallelStream()
                .filter(entry -> entry.getValue().size() > 1)
                .forEach(entry -> {
                    synchronized (builder) {
                        builder.putAll(entry.getKey(), entry.getValue());
                    }
                });
        return builder.build();
    }
}
