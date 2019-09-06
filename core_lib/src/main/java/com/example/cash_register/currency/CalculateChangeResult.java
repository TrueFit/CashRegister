package com.example.cash_register.currency;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.collections4.BagUtils;
import org.apache.commons.collections4.SortedBag;
import org.apache.commons.collections4.bag.TreeBag;
import org.apache.commons.collections4.bag.UnmodifiableSortedBag;
import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Contains the results of a calculate change operation.
 */
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter(AccessLevel.PACKAGE)
public class CalculateChangeResult {
    /**
     * An identifier for this result.
     */
    @Getter
    private final UUID uuid = UUID.randomUUID();
    /**
     * The calculate change args which produced this result.
     */
    private CalculateChangeArgs inputArgs;
    /**
     * If no exceptions occurred, the bag of change of this result.
     */
    private SortedBag<PhysicalCurrency> outputChangeBag = BagUtils.emptySortedBag();
    /**
     * This list contains any exceptions which occurred during the calculate change operation.
     */
    private List<Throwable> outputResultExceptionList = Collections.emptyList();

    /**
     * This helper method generates a result object for a successful change calculation (i.e., a change bag is
     * available, and no exceptions occurred).
     *
     * @param inputArgs The input used to calculate the result.
     * @param changeCollection The change collection to put in the result.
     *
     * @return The result.
     */
    public static CalculateChangeResult successful(CalculateChangeArgs inputArgs, Collection<PhysicalCurrency> changeCollection) {
        CalculateChangeResult result = new CalculateChangeResult();
        TreeBag<PhysicalCurrency> placeholder = new TreeBag<>(changeCollection);
        result.outputChangeBag = UnmodifiableSortedBag.unmodifiableSortedBag(placeholder);
        result.inputArgs = inputArgs;
        return result;
    }

    /**
     * This helper method generates a result object for an unsuccessful change calculation (i.e., a change bag is not
     * available, and exceptions occurred).
     *
     * @param inputArgs The input used to calculate the result.
     * @param throwableCollection The collection of exceptions which occurred.
     *
     * @return The result.
     */
    public static CalculateChangeResult unsuccessful(CalculateChangeArgs inputArgs, Collection<Throwable> throwableCollection) {
        CalculateChangeResult result = new CalculateChangeResult();
        result.outputResultExceptionList = List.copyOf(throwableCollection);
        result.inputArgs = inputArgs;
        return result;
    }

    /**
     * The change bag of this result.
     *
     * @return The change bag of this result.
     */
    public final SortedBag<PhysicalCurrency> getOutputChangeBag() {
        return UnmodifiableSortedBag.unmodifiableSortedBag(this.outputChangeBag);
    }

    /**
     * A flag to test the success of this result.
     *
     * @return {@code true}, if the exception collection of this result is empty; otherwise, returns {@code false}.
     */
    public final boolean isSuccessful() {
        return this.getOutputResultExceptionList().isEmpty();
    }

    /**
     * Negates the {@link #isSuccessful()} flag.
     */
    public final boolean isNotSuccessful() {
        return ! this.isSuccessful();
    }

    /**
     * This list contains any exceptions which occurred during the calculate change operation.
     */
    public List<Throwable> getOutputResultExceptionList() {
        return outputResultExceptionList;
    }

    /**
     * Used by Jackson to write out this result.
     *
     * @see CalculateChangeResult
     */
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    @JsonPropertyOrder({"uuid", "inputArgs", "outputChangeBag", "outputResultExceptionList"})
    public static final class OutputModel {
        /**
         * A list of exceptions which occurred during change calculation.
         */
        private List<Throwable> outputResultExceptionList = Collections.emptyList();
        /**
         * The identifier for this result.
         */
        @JsonProperty
        @Getter(AccessLevel.PACKAGE)
        private UUID uuid;
        /**
         * The input for this result.
         */
        @JsonProperty
        private CalculateChangeArgs.OutputModel inputArgs;
        /**
         * The change bag for this result.
         */
        @JsonProperty
        @JsonSerialize(using = ToStringSerializer.class)
        private SortedBag<PhysicalCurrency> outputChangeBag = BagUtils.emptySortedBag();

        /**
         * A string representation of the exception collection.
         *
         * @return A string representation of the exception collection.
         *
         * @see #outputResultExceptionList
         */
        @JsonProperty
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        private List<String> getOutputResultExceptionList() {
            return this.outputResultExceptionList
                    .parallelStream()
                    .map(Throwable::toString)
                    .collect(Collectors.toUnmodifiableList());
        }
    }

    /**
     * A {@link ModelMapper} converter object which converts a calculate change result object to its {@link
     * OutputModel}.
     */
    static final class ResultToOutputModelConverter extends AbstractConverter<CalculateChangeResult, OutputModel> {
        /**
         * Implementation of {@link AbstractConverter#convert(Object)}; performs the conversion.
         *
         * @param source The source object.
         *
         * @return The {@link OutputModel}
         */
        @Override
        protected OutputModel convert(final CalculateChangeResult source) {
            final SortedBag<PhysicalCurrency> outputChangeBagCopy = new TreeBag<>(List.copyOf(source.outputChangeBag));
            final List<Throwable> outputResultExceptionListCopy = List.copyOf(source.outputResultExceptionList);
            final CalculateChangeArgs.ArgsToOutputModelConverter inputArgsConverter =
                    new CalculateChangeArgs.ArgsToOutputModelConverter();

            final OutputModel outputModel = new OutputModel();
            outputModel.inputArgs = inputArgsConverter.convert(source.inputArgs);
            outputModel.uuid = source.uuid;
            outputModel.outputChangeBag = outputChangeBagCopy;
            outputModel.outputResultExceptionList = outputResultExceptionListCopy;
            return outputModel;
        }
    }
}
