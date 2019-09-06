package com.example.cash_register.currency;

import com.example.cash_register.shared.io.FilesWrapper;
import com.example.cash_register.shared.mappers.ObjectMapperConfig;
import com.example.cash_register.shared.spring.SpringContextUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.StringWriter;
import java.io.Writer;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

/**
 * Provides various methods to write calculate change results to output.
 */
public class CalculateChangeResultsWriter implements AutoCloseable {
    /**
     * Default filename for output.
     */
    public static final String DEFAULT_OUTPUT_FILENAME = "output.json";
    /**
     * The output writer.
     */
    private final Writer outputWriter;
    /**
     * The output path, if an output file exists; otherwise, {@code null}.
     *
     * @see #findOutputPath()
     */
    private Path outputPath;
    /**
     * If a temp directory was created for this writer, this will contain that temp directory; otherwise, {@code null}.
     */
    private Path createdTempDirectory;

    /**
     * Constructor providing a writer.
     *
     * @param outputWriter The writer to use.
     */
    private CalculateChangeResultsWriter(final Writer outputWriter) {
        this.outputWriter = outputWriter;
    }

    /**
     * Constructor providing a file.
     *
     * @param outputFile The file to use.
     */
    private CalculateChangeResultsWriter(final Path outputFile) {
        this(SpringContextUtils.getBean(FilesWrapper.class).newBufferedWriter(outputFile));
        this.outputPath = outputFile;
    }

    /**
     * Creates a calculate change results writer which writes to the provided writer.
     *
     * @param outputWriter The writer to use.
     *
     * @return A {@code CalculateChangeResultsWriter}
     */
    static CalculateChangeResultsWriter create(final Writer outputWriter) {
        return new CalculateChangeResultsWriter(outputWriter);
    }

    /**
     * Creates a calculate change results writer which writes to the provided file.
     *
     * @param outputFile The file to use.
     *
     * @return A {@code CalculateChangeResultsWriter}
     */
    public static CalculateChangeResultsWriter create(final Path outputFile) {
        FilesWrapper filesWrapper = SpringContextUtils.getBean(FilesWrapper.class);
        return create(filesWrapper.newBufferedWriter(outputFile));
    }

    /**
     * Creates a calculate change results writer which writes to the {@code StringWriter.nullWriter()}; this is useful
     * for testing.
     *
     * @return A {@code CalculateChangeResultsWriter}
     */
    static CalculateChangeResultsWriter create() {
        return new CalculateChangeResultsWriter(StringWriter.nullWriter());
    }

    /**
     * Creates a calculate change results writer which writes to a temp directory using the default output file name.
     *
     * @return A {@code CalculateChangeResultsWriter}
     *
     * @see #DEFAULT_OUTPUT_FILENAME
     */
    static CalculateChangeResultsWriter createTempDirectoryWriter() {
        return createTempDirectoryWriter(DEFAULT_OUTPUT_FILENAME);
    }

    /**
     * Creates a calculate change results writer which writes to a temp directory using the provided output file name.
     *
     * @param outputFileString The file name.
     *
     * @return A {@code CalculateChangeResultsWriter}
     *
     * @throws CreateTempDirectoryWriterException If the {@code outputFile} is null, empty, or whitespace.
     */
    static CalculateChangeResultsWriter createTempDirectoryWriter(final String outputFileString) {
        final FilesWrapper filesWrapper = SpringContextUtils.getBean(FilesWrapper.class);
        final Path tempDirectory = filesWrapper.createTempDir();
        try {
            final Path outputFile = tempDirectory.resolve(outputFileString);
            final CalculateChangeResultsWriter resultsWriter = new CalculateChangeResultsWriter(outputFile);
            resultsWriter.createdTempDirectory = tempDirectory;
            return resultsWriter;
        }
        catch (final Throwable throwable) {
            FileUtils.deleteQuietly(tempDirectory.toFile());
            final String message = String.format(
                    "could not create temp directory writer. outputFileString => %s",
                    outputFileString);
            throw new CreateTempDirectoryWriterException(message, throwable);
        }
    }

    /**
     * Creates a calculate change results writer which writes to the build directory using the default output file name;
     * this is useful for testing.
     *
     * @return A {@code CalculateChangeResultsWriter}
     */
    static CalculateChangeResultsWriter createBuildDirectoryWriter() {
        Path buildDir = Paths.get("build");
        Path outputPath = buildDir.resolve(DEFAULT_OUTPUT_FILENAME);
        return new CalculateChangeResultsWriter(outputPath);
    }

    /**
     * Returns an {@code Optional<Path>} which contains the output file path, if it exists; not all calculate change
     * results writers write to files, so this does not necessarily exist.
     *
     * @return An {@code Optional<Path>} which contains the output file path, if it exists.
     */
    public Optional<Path> findOutputPath() {
        return Optional.ofNullable(this.outputPath);
    }

    /**
     * A wrapper for {@link #findOutputPath()} which returns the output file path, if it exists, or throws an exception,
     * if it does not.
     *
     * @return The output file path, if it exists.
     *
     * @throws QueryOutputPathException If the option from {@link #findOutputPath()} is empty.
     * @see #findOutputPath()
     */
    public Path queryOutputPath() {
        return this.findOutputPath().orElseThrow(QueryOutputPathException::new);
    }

    /**
     * Returns an {@code Optional<Path>} which contains the temp directory created by this writer, if a temp directory
     * was created.
     *
     * @return An {@code Optional<Path>} which contains the temp directory created by this writer, if a temp directory
     * was created.
     */
    public Optional<Path> findCreatedTempDirectory() {
        return Optional.ofNullable(this.createdTempDirectory);
    }

    /**
     * A wrapper for {@link #findCreatedTempDirectory()} which returns the temp directory created by this writer, if a
     * temp directory was created, or throws an exception, if no temp directory was created by this writer.
     *
     * @return The temp directory created by this writer, if a temp directory was created.
     *
     * @throws QueryCreatedTempDirectoryException If the option from {@link #findCreatedTempDirectory()} is empty.
     * @see #findCreatedTempDirectory()
     */
    public Path queryCreatedTempDirectory() {
        return this.findCreatedTempDirectory().orElseThrow(QueryCreatedTempDirectoryException::new);
    }

    /**
     * Writes the provided result to output; after this method has been invoked and returned, the output writer will be
     * closed.
     *
     * @param result The result to write.
     *
     * @see #write(Collection)
     */
    public final void write(CalculateChangeResult result) {
        if (result == null) {
            this.close();
            throw new WriteResultNullException();
        }
        this.write(Collections.singleton(result));
    }

    /**
     * Writes the provided result list to output; after this method has been invoked and returned, the output writer
     * will be closed.
     *
     * @param resultCollection The result list to write.
     *
     * @throws WriteResultCollectionNullException When {@code resultCollection} is null.
     * @throws WriteResultCollectionEmptyException When {@code resultCollection} is empty.
     * @throws WriteResultsObjectMapperWriteValueException If {@link ObjectWriter#writeValue(Writer, Object)} fails,
     * that exception will be the cause.
     */
    public final void write(final Collection<CalculateChangeResult> resultCollection) {
        if (resultCollection == null) {
            this.close();
            throw new WriteResultCollectionNullException();
        }
        if (resultCollection.isEmpty()) {
            this.close();
            throw new WriteResultCollectionEmptyException();
        }

        final CurrencyModelMapper currencyModelMapper = SpringContextUtils.getBean(CurrencyModelMapper.class);
        final List<CalculateChangeResult.OutputModel> resultOutputModelList = currencyModelMapper.mapToOutputModel(resultCollection);
        final OutputModel writerOutputModel = OutputModel.create(resultOutputModelList);

        final ObjectMapper jsonObjectMapper = SpringContextUtils.getBean(ObjectMapperConfig.JSON_OBJECT_MAPPER_QUALIFIER, ObjectMapper.class);
        try {
            jsonObjectMapper.writerWithDefaultPrettyPrinter().writeValue(this.outputWriter, writerOutputModel);
        }
        catch (final Throwable throwable) {
            throw new WriteResultsObjectMapperWriteValueException(throwable);
        }
        finally {
            this.close();
        }
    }

    /**
     * The writer output model, which consists of a list of {@link CalculateChangeResult.OutputModel} objects
     * and the output locale language tag.
     */
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    @JsonPropertyOrder({"outputLocaleLanguageTag", "outputList"})
    public static final class OutputModel {
        /**
         * Output locale language tag.
         */
        @JsonProperty
        private String outputLocaleLanguageTag;

        /**
         * The list of {@link CalculateChangeResult.OutputModel} objects.
         */
        @JsonProperty
        private List<CalculateChangeResult.OutputModel> outputList;

        /**
         * Creates an {@link OutputModel} object containing the provided results output model and the output locale
         * language tag.
         * @param outputList The list of {@link CalculateChangeResult.OutputModel}.
         * @return An output model populated with the provided results output model and the output locale language tag.
         * @see CalculateChangeResult.OutputModel
         * @see CashRegisterProperties#getOutputLocale()
         * @see Locale#toLanguageTag()
         */
        public static OutputModel create(final List<CalculateChangeResult.OutputModel> outputList) {
            final CashRegisterProperties cashRegisterProperties = SpringContextUtils.getBean(CashRegisterProperties.class);

            final OutputModel outputModel = new OutputModel();
            outputModel.outputLocaleLanguageTag = cashRegisterProperties.getOutputLocale().toLanguageTag();
            outputModel.outputList = outputList;
            return outputModel;
        }
    }

   /**
     * Closes the {@link #outputWriter} of this writer.
     *
     * @throws CloseException If {@code this.outputWriter.close()} throws an exception; that exception will be the
     * cause.
     */
    @Override
    public void close() {
        try {
            this.outputWriter.close();
        }
        catch (final Throwable throwable) {
            throw new CloseException(throwable);
        }
    }

    static final class WriteResultNullException extends CashRegisterException {
        private WriteResultNullException() {
            super("result must not be null");
        }
    }

    /**
     * See {@link #createTempDirectoryWriter(String)}
     *
     * @see #createTempDirectoryWriter(String)
     */
    static final class CreateTempDirectoryWriterException extends RuntimeException {
        CreateTempDirectoryWriterException(String message, Throwable throwable) {
            super(message, throwable);
        }
    }

    /**
     * See {@link #write(Collection)}
     *
     * @see #write(Collection)
     */
    static final class WriteResultCollectionNullException extends RuntimeException {
        WriteResultCollectionNullException() {
            super("resultCollection must not be null");
        }
    }

    /**
     * See {@link #write(Collection)}
     *
     * @see #write(Collection)
     */
    static final class WriteResultCollectionEmptyException extends RuntimeException {
        WriteResultCollectionEmptyException() {
            super("resultCollection must not be empty");
        }
    }

    /**
     * See {@link #write(Collection)}
     *
     * @see #write(Collection)
     */
    static final class WriteResultsObjectMapperWriteValueException extends RuntimeException {
        WriteResultsObjectMapperWriteValueException(Throwable cause) {
            super("could not write results to outputWriter", cause);
        }
    }

    /**
     * See {@link #queryOutputPath()}
     *
     * @see #queryOutputPath()
     */
    static final class QueryOutputPathException extends RuntimeException {
        QueryOutputPathException() {
            super(StringUtils.EMPTY);
        }
    }

    /**
     * See {@link #close()}
     *
     * @see #close()
     */
    static final class CloseException extends CashRegisterException {
        CloseException(Throwable cause) {
            super("exception during close", cause);
        }
    }

    /**
     * See {@link #queryCreatedTempDirectory()}
     *
     * @see #queryCreatedTempDirectory()
     */
    static final class QueryCreatedTempDirectoryException extends RuntimeException {
        QueryCreatedTempDirectoryException() {
            super(StringUtils.EMPTY);
        }
    }
}
