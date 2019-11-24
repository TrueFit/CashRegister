package com.example.cash_register.currency;

import com.google.common.collect.Multimaps;
import com.google.common.collect.SortedSetMultimap;
import com.google.common.collect.TreeMultimap;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.modelmapper.config.Configuration;

import java.lang.reflect.Type;
import java.util.Collection;
import java.util.Comparator;
import java.util.Currency;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * A subclass of {@link ModelMapper} for this project, which maps various collections and models of currency.
 */
public class CurrencyModelMapper extends ModelMapper {
    /**
     * {@link Type} returned from a {@link TypeToken} for use in {@link #mapToOutputModel(Collection)}.
     */
    private static final Type LIST_OF_CALCULATE_CHANGE_RESULT_OUTPUT_MODEL_TYPE =
            new TypeToken<List<CalculateChangeResult.OutputModel>>() {
            }.getType();

    /**
     * {@link Type} returned from a {@link TypeToken} for use in {@link #mapToSortedSetMultimap(PhysicalSetConfigParserResultCollection)}.
     */
    private static final Type SORTED_SET_MULTIMAP_OF_CURRENCY_AND_PHYSICAL_CURRENCY_TYPE =
            new TypeToken<SortedSetMultimap<Currency, PhysicalCurrency>>() {
            }.getType();

    /**
     * Currency comparator; used by the converted sorted set multimap to sort the keys in {@link
     * ParserResultsCollectionToSortedSetMultimapOfCurrencyToPhysicalCurrencyConverter}.
     */
    private static final Comparator<Currency> CURRENCY_COMPARATOR = new CurrencyByCurrencyCodeComparator();


    /**
     * Constructor; sets up configuration and converters.
     */
    CurrencyModelMapper() {
        super();

        this.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(Configuration.AccessLevel.PACKAGE_PRIVATE);
        this.addConverter(new PhysicalSetConfigToSetOfPhysicalCurrencyConverter());
        this.addConverter(new ParserResultsCollectionToSortedSetMultimapOfCurrencyToPhysicalCurrencyConverter());
        this.addConverter(new CalculateChangeArgs.ArgsToOutputModelConverter());
        this.addConverter(new CalculateChangeResult.ResultToOutputModelConverter());
    }

    /**
     * Maps a collection of calculate change results into the output model format
     *
     * @param item The collection of calculate change results
     *
     * @return A list of calculate change result output models
     */
    public List<CalculateChangeResult.OutputModel> mapToOutputModel(final Collection<CalculateChangeResult> item) {
        return this.map(item, LIST_OF_CALCULATE_CHANGE_RESULT_OUTPUT_MODEL_TYPE);
    }

    /**
     * Maps a {@link PhysicalSetConfigParserResultCollection} to a sorted multimap of currency to physical currency.
     *
     * @param item The {@link PhysicalSetConfigParserResultCollection}
     *
     * @return A sorted multimap of currency to physical currency.
     *
     * @see Currency
     * @see PhysicalCurrency
     * @see SortedSetMultimap
     */
    public SortedSetMultimap<Currency, PhysicalCurrency> mapToSortedSetMultimap(final PhysicalSetConfigParserResultCollection item) {
        return this.map(item, SORTED_SET_MULTIMAP_OF_CURRENCY_AND_PHYSICAL_CURRENCY_TYPE);
    }

    /**
     * A {@link ModelMapper} converter object which converts a physical set config into a set of physical currency.
     *
     * @see AbstractConverter
     * @see PhysicalSetConfig
     */
    @SuppressWarnings("UnnecessaryLocalVariable")
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    private final static class PhysicalSetConfigToSetOfPhysicalCurrencyConverter
            extends AbstractConverter<PhysicalSetConfig, Set<PhysicalCurrency>> {

        /**
         * Implementation of {@link AbstractConverter#convert(Object)}; performs the conversion.
         *
         * @param source The source object; a physical set configuration.
         *
         * @return The set of physical currency.
         */
        @Override
        protected Set<PhysicalCurrency> convert(final PhysicalSetConfig source) {
            final Currency currency = source.getCurrency();
            final Set<PhysicalCurrency> physicalCurrencySet = source.getCurrencyValues()
                    .parallelStream()
                    .map(unitValueAndName -> this.toPhysicalCurrency(currency, unitValueAndName))
                    .collect(Collectors.toCollection(HashSet::new));
            return physicalCurrencySet;
        }

        /**
         * Helper methods to convert a currency and unit name and value into a physical currency.
         *
         * @param currency The currency.
         * @param unitValueAndName The unit value and name of the physical currency.
         *
         * @return The physical currency.
         */
        private PhysicalCurrency toPhysicalCurrency(final Currency currency, final UnitValueAndName unitValueAndName) {
            final String name = unitValueAndName.getName();
            final UnitValue unitValue = unitValueAndName.getUnitValue();

            final CurrencyValue currencyValue = CurrencyValue.builder()
                    .currency(currency)
                    .unitValue(unitValue)
                    .build();
            final PhysicalCurrency physicalCurrency = PhysicalCurrency.builder()
                    .currencyValue(currencyValue)
                    .name(name)
                    .build();
            return physicalCurrency;
        }
    }

    /**
     * A {@link ModelMapper} converter object which converts a physical set configuration result collection into a
     * sorted set multimap of currency to physical currency.
     *
     * @see AbstractConverter
     * @see PhysicalSetConfigParserResultCollection
     * @see PhysicalSetConfigToSetOfPhysicalCurrencyConverter
     * @see SortedSetMultimap
     * @see PhysicalSetMap
     */
    private final static class ParserResultsCollectionToSortedSetMultimapOfCurrencyToPhysicalCurrencyConverter
            extends AbstractConverter<PhysicalSetConfigParserResultCollection, SortedSetMultimap<Currency, PhysicalCurrency>> {

        /**
         * See {@link PhysicalSetConfigToSetOfPhysicalCurrencyConverter}; used to convert physical currency
         * configurations to physical currency sets for the converted sorted set multimap.
         */
        private final PhysicalSetConfigToSetOfPhysicalCurrencyConverter setOfPhysicalCurrencyConverter =
                new PhysicalSetConfigToSetOfPhysicalCurrencyConverter();

        /**
         * Implementation of {@link AbstractConverter#convert(Object)}; performs the conversion.
         *
         * @param source The source object; a collection of physical set configuration results.
         *
         * @return The {@link SortedSetMultimap}, which maps currency to physical currency sets.
         */
        @Override
        protected SortedSetMultimap<Currency, PhysicalCurrency> convert(final PhysicalSetConfigParserResultCollection source) {
            final SortedSetMultimap<Currency, PhysicalCurrency> sortedSetMultimap =
                    Multimaps.synchronizedSortedSetMultimap(TreeMultimap.create(CURRENCY_COMPARATOR, PhysicalCurrency::compareTo));
            source.parallelStream()
                    .map(this::toMapEntry)
                    .forEach(entry -> {
                        synchronized (sortedSetMultimap) {
                            sortedSetMultimap.putAll(entry.getKey(), entry.getValue());
                        }
                    });
            return Multimaps.unmodifiableSortedSetMultimap(sortedSetMultimap);
        }

        /**
         * Converts a physical set configuration result to a map entry for the sorted set multimap.
         *
         * @param physicalSetConfigParserResult The physical set configuration result.
         *
         * @return A map entry ready to be added to a sorted set multimap.
         *
         * @see #convert(PhysicalSetConfigParserResultCollection)
         */
        private Map.Entry<Currency, Set<PhysicalCurrency>> toMapEntry(final PhysicalSetConfigParserResult physicalSetConfigParserResult) {
            final PhysicalSetConfig physicalSetConfig = physicalSetConfigParserResult.queryPhysicalSetConfig();
            final Currency key = physicalSetConfig.getCurrency();
            final Set<PhysicalCurrency> value = this.setOfPhysicalCurrencyConverter.convert(physicalSetConfig);
            return Map.entry(key, value);
        }
    }
}
