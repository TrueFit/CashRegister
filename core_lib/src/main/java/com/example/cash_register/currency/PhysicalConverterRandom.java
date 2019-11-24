package com.example.cash_register.currency;

import com.example.cash_register.shared.random.RandomUtils;
import org.apache.commons.collections4.SortedBag;
import org.apache.commons.collections4.bag.TreeBag;
import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Currency;
import java.util.Deque;
import java.util.SortedSet;


/**
 * An implementation of {@link PhysicalConverterBase} which converts a currency value to a physical currency bag using
 * random pieces of physical currency.
 *
 * @see PhysicalCurrencyDeque
 * @see PhysicalCurrency
 */
@Component(PhysicalConverterRandom.QUALIFIER)
public final class PhysicalConverterRandom extends PhysicalConverterBase {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.PhysicalConverterRandom";
    /**
     * See {@link PhysicalSetMap}.
     */
    private final PhysicalSetMap physicalSetMap;

    /**
     * Autowired constructor.
     *
     * @param physicalSetMap See {@link PhysicalSetMap}.
     */
    PhysicalConverterRandom(final PhysicalSetMap physicalSetMap) {
        this.physicalSetMap = physicalSetMap;
    }

    /**
     * Converts the currency value to a random bag of physical currency.
     *
     * @param currencyValue The currency value to convert.
     *
     * @return The bag of physical currency.
     *
     * @see PhysicalCurrencyDeque
     * @see PhysicalCurrencyDeque#getRandom()
     */
    @Override
    protected SortedBag<PhysicalCurrency> convertToPhysicalCurrencyImpl(final CurrencyValue currencyValue) {
        final Currency currency = currencyValue.getCurrency();

        CurrencyValue workingValue = currencyValue;
        final SortedBag<PhysicalCurrency> changeBag = new TreeBag<>();
        final SortedSet<PhysicalCurrency> physicalCurrencySet = this.physicalSetMap.get(currency);

        /* create a deque from the physical currency set. */
        /* physical currency sorts from largest value to smallest value */
        final PhysicalCurrencyDeque deque = PhysicalCurrencyDeque.create(physicalCurrencySet);
        do {
            /* get the first value, which is the largest available */
            final PhysicalCurrency currentLargestCurrency = deque.getFirst();
            /* while working value is greater than or equal to the current largest value... */
            while (workingValue.greaterThanOrEqualTo(currentLargestCurrency)) {
                /* ...get a random piece of currency from the deque, subtract it from the working value,
                    and add the piece to the change bag, then loop. */
                final PhysicalCurrency random = deque.getRandom();
                workingValue = workingValue.subtract(random);
                changeBag.add(random);
            }
            /* once the working value is less than the current largest currency, remove the largest off the deque, and
                repeat */
            deque.removeFirst();
        }
        while (! deque.isEmpty());

        return changeBag;
    }

    /**
     * Partial implementation of a deque of physical currency objects, which includes a {@code .getRandom()} method for use during
     * {@link ChangeCalculatorRandom#calculate(CalculateChangeArgs)}.
     */
    final static class PhysicalCurrencyDeque {
        /**
         * The delegate for this deque.
         */
        private final ArrayDeque<PhysicalCurrency> delegate;

        /**
         * Array which caches the elements of this deque for use with {@link #getRandom()}; this array must be
         * set to {@code null} when the elements of this deque change (only {@link #removeFirst()} modifies
         * this deque).
         *
         * @see #getRandom()
         * @see #removeFirst()
         */
        private PhysicalCurrency[] currentArrayInternal = null;

        /**
         * Creates this physical currency deque with the provided initial capacity, by setting the delegate to a new {@link
         * ArrayDeque}.
         *
         * @param capacity The initial capacity.
         *
         * @see ArrayDeque#ArrayDeque(int)
         */
        private PhysicalCurrencyDeque(final int capacity) {
            this.delegate = new ArrayDeque<>(capacity);
        }

        /**
         * Creates a {@code PhysicalCurrencyDeque} and populates it with the provided
         * {@link SortedSet} of {@link PhysicalCurrency}.
         *
         * @param physicalCurrencySortedSet The sorted set to populate this deque.
         *
         * @return The deque, populated with the provided physical currencies.
         */
        static PhysicalCurrencyDeque create(final SortedSet<PhysicalCurrency> physicalCurrencySortedSet) {
            final PhysicalCurrencyDeque deque = new PhysicalCurrencyDeque(physicalCurrencySortedSet.size());
            deque.delegate.addAll(physicalCurrencySortedSet);
            return deque;
        }

        /**
         * Lazy getter for {@link #currentArrayInternal}.
         *
         * @return {@link #currentArrayInternal}, after ensuring it has been populated with the internal array of this
         * deque.
         */
        private PhysicalCurrency[] getCurrentArray() {
            if (currentArrayInternal == null) {
                this.currentArrayInternal = this.delegate.toArray(PhysicalCurrency[]::new);
            }
            return currentArrayInternal;
        }

        /**
         * Retrieves, but does not remove, a random element in this deque.
         *
         * @return A random element from this deque.
         *
         * @throws GetRandomIsEmptyException If this deque is empty.
         */
        PhysicalCurrency getRandom() {
            if (this.delegate.isEmpty()) {
                throw new GetRandomIsEmptyException();
            }
            else if (this.delegate.size() == 1) {
                return this.delegate.getFirst();
            }
            else {
                return RandomUtils.getInstance().getRandomElement(this.getCurrentArray());
            }
        }

        /**
         * Implementation of {@link Deque#getFirst()}.  Note: this method is treated as though {@link Deque} is being
         * implemented, so it is intentionally {@code public}.
         *
         * @return Per, {@link Deque#getFirst()}
         *
         * @see Deque#getFirst()
         */
        @SuppressWarnings("WeakerAccess")
        public PhysicalCurrency getFirst() {
            return this.delegate.getFirst();
        }

        /**
         * Implementation of {@link Deque#removeFirst()}.  Note: this method is treated as though {@link Deque} is
         * being implemented, so it is intentionally {@code public} and, also, returns the removed item.
         *
         * @return Per, {@link Deque#removeFirst()}
         *
         * @see Deque#removeFirst()
         */
        @SuppressWarnings({"UnusedReturnValue", "WeakerAccess"})
        public PhysicalCurrency removeFirst() {
            PhysicalCurrency physicalCurrency = this.delegate.removeFirst();
            this.currentArrayInternal = null;
            return physicalCurrency;
        }

        /**
         * Implementation of {@link Deque#isEmpty()}.  Note: this method is treated as though {@link Deque} is being
         * implemented, so it is intentionally {@code public}.
         *
         * @return Per, {@link Deque#isEmpty()}
         *
         * @see Deque#isEmpty()
         */
        public boolean isEmpty() {
            return this.delegate.isEmpty();
        }

        /**
         * See {@link #getRandom()}
         *
         * @see #getRandom()
         */
        static final class GetRandomIsEmptyException extends CashRegisterException {
            private GetRandomIsEmptyException() {
                super("deque is empty");
            }
        }
    }
}
