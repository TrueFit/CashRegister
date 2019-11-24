package com.example.tango.lib;

import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.CalculateChangeResultsWriter;
import com.example.cash_register.currency.CurrencyModelMapper;
import com.example.cash_register.shared.exceptions.CompoundException;
import com.example.cash_register.shared.exceptions.ExceptionList;
import com.example.cash_register.shared.io.FilesWrapper;
import com.example.cash_register.shared.io.WriterWrapper;
import com.example.cash_register.shared.spring.SpringContextUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.Writer;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Provides various methods to write calculate change results to output.
 */
public final class TangoResultsWriter implements AutoCloseable {
    /**
     * Default filename for change output and error summary.
     */
    public static final String DEFAULT_CHANGE_OUTPUT_AND_ERROR_SUMMARY_FILENAME = "change_output_and_error_summary.txt";
    /**
     * Default filename for error details.
     */
    public static final String DEFAULT_ERROR_DETAILS_FILENAME = "error_details.json";
    /**
     * The change output and error summary writer.
     */
    private final Writer changeOutputAndErrorSummaryWriter;
    /**
     * The error details writer.
     */
    private final Writer errorDetailsWriter;
    /**
     * The change output and error summary file, if a change summary and error summary file exists; otherwise, {@code
     * null}.
     */
    private Path changeOutputAndErrorSummaryFile;
    /**
     * The error details file; if an error details file exists; otherwise, {@code null}.
     */
    private Path errorDetailsFile;
    /**
     * If a temp directory was created for this writer, this will contain that temp directory; otherwise, {@code null}.
     */
    private Path createdTempDirectory;

    /**
     * Constructor providing writers.
     *
     * @param changeOutputAndErrorSummaryWriter The change output and error summary writer.
     * @param errorDetailsWriter The error writer.
     */
    private TangoResultsWriter(final Writer changeOutputAndErrorSummaryWriter, final Writer errorDetailsWriter) {
        this.changeOutputAndErrorSummaryWriter = changeOutputAndErrorSummaryWriter;
        this.errorDetailsWriter = errorDetailsWriter;
    }

    /**
     * Constructor providing files.
     *
     * @param changeOutputAndErrorSummaryFile The change output and error summary file.
     * @param errorDetailsFile The error details file.
     */
    private TangoResultsWriter(final Path changeOutputAndErrorSummaryFile, final Path errorDetailsFile) {
        this(
                SpringContextUtils.getBean(FilesWrapper.class).newBufferedWriter(changeOutputAndErrorSummaryFile),
                SpringContextUtils.getBean(FilesWrapper.class).newBufferedWriter(errorDetailsFile));

        this.changeOutputAndErrorSummaryFile = changeOutputAndErrorSummaryFile;
        this.errorDetailsFile = errorDetailsFile;
    }

    /**
     * Creates a results writer which writes to the provided writers.
     *
     * @param changeOutputAndErrorSummaryWriter The change output and error summary writer.
     * @param errorDetailsWriter The error details writer.
     *
     * @return A {@link TangoResultsWriter}
     */
    static TangoResultsWriter create(final Writer changeOutputAndErrorSummaryWriter, final Writer errorDetailsWriter) {
        return new TangoResultsWriter(changeOutputAndErrorSummaryWriter, errorDetailsWriter);
    }

    /**
     * Creates a results writer which writes to the provided files.
     *
     * @param changeOutputAndErrorSummaryFile The change output and error summary file.
     * @param errorDetailsFile The error details file.
     *
     * @return A {@link TangoResultsWriter}
     */
    public static TangoResultsWriter create(final Path changeOutputAndErrorSummaryFile, final Path errorDetailsFile) {
        return new TangoResultsWriter(changeOutputAndErrorSummaryFile, errorDetailsFile);
    }

    /**
     * Creates a writer which writes to a temp directory using the default output file names.
     *
     * @return A {@code TangoResultsWriter}
     *
     * @see #DEFAULT_CHANGE_OUTPUT_AND_ERROR_SUMMARY_FILENAME
     * @see #DEFAULT_ERROR_DETAILS_FILENAME
     */
    static TangoResultsWriter createTempDirectoryWriter() {
        return createTempDirectoryWriter(DEFAULT_CHANGE_OUTPUT_AND_ERROR_SUMMARY_FILENAME, DEFAULT_ERROR_DETAILS_FILENAME);
    }

    /**
     * Creates a writer which writes to a temp directory using the provided file names.
     *
     * @param changeOutputAndErrorSummaryFilename The change output and error summary will be written to this filename.
     * @param errorDetailsFilename The error details will be written to this filename.
     *
     * @return A {@code TangoResultsWriter}
     *
     * @throws CreateTempDirectoryWriterException When the output files or directory could not be created.
     */
    static TangoResultsWriter createTempDirectoryWriter(String changeOutputAndErrorSummaryFilename, String errorDetailsFilename) {
        final FilesWrapper filesWrapper = SpringContextUtils.getBean(FilesWrapper.class);
        final Path tempDirectory = filesWrapper.createTempDir();
        try {
            final Path changeOutputAndErrorSummaryFile = tempDirectory.resolve(changeOutputAndErrorSummaryFilename);
            final Path errorDetailsFile = tempDirectory.resolve(errorDetailsFilename);

            final TangoResultsWriter resultsWriter = new TangoResultsWriter(changeOutputAndErrorSummaryFile, errorDetailsFile);
            resultsWriter.createdTempDirectory = tempDirectory;
            return resultsWriter;
        }
        catch (final Throwable throwable) {
            FileUtils.deleteQuietly(tempDirectory.toFile());
            throw new CreateTempDirectoryWriterException(throwable);
        }
    }

    /**
     * Creates a writer which writes to the build directory using the default output file names. This is useful for
     * testing.
     *
     * @return A {@code TangoResultsWriter}
     *
     * @see #DEFAULT_CHANGE_OUTPUT_AND_ERROR_SUMMARY_FILENAME
     * @see #DEFAULT_ERROR_DETAILS_FILENAME
     */
    static TangoResultsWriter createBuildDirectoryWriter() {
        Path buildDir = Paths.get("build");
        Path changeOutputAndErrorWriterFile = buildDir.resolve(TangoResultsWriter.DEFAULT_CHANGE_OUTPUT_AND_ERROR_SUMMARY_FILENAME);
        Path errorDetailsFile = buildDir.resolve(TangoResultsWriter.DEFAULT_ERROR_DETAILS_FILENAME);
        return new TangoResultsWriter(changeOutputAndErrorWriterFile, errorDetailsFile);
    }

    /**
     * Returns an {@code Optional<Path>} which contains the change output and error summary file path, if it exists; not
     * all writers write to files, so this does not necessarily exist.
     *
     * @return An {@code Optional<Path>} which contains the change output and error summary file path, if it exists.
     */
    public Optional<Path> findChangeOutputAndErrorSummaryFile() {
        return Optional.ofNullable(this.changeOutputAndErrorSummaryFile);
    }

    /**
     * A wrapper for {@link #findChangeOutputAndErrorSummaryFile()} which returns the change output and error summary
     * file path, if it exists, or throws an exception, if it does not.
     *
     * @return The change output and error summary file path, if it exists.
     *
     * @throws QueryChangeOutputAndErrorSummaryFileException If the option from {@link
     * #findChangeOutputAndErrorSummaryFile()} is empty.
     * @see #findChangeOutputAndErrorSummaryFile()
     */
    public Path queryChangeOutputAndErrorSummaryFile() {
        return this.findChangeOutputAndErrorSummaryFile().orElseThrow(QueryChangeOutputAndErrorSummaryFileException::new);
    }

    /**
     * Returns an {@code Optional<Path>} which contains the error details file path, if it exists; not all writers write
     * to files, so this does not necessarily exist.
     *
     * @return An {@code Optional<Path>} which contains the error details file path, if it exists.
     */
    public Optional<Path> findErrorDetailsFile() {
        return Optional.ofNullable(this.errorDetailsFile);
    }

    /**
     * A wrapper for {@link #findErrorDetailsFile()} which returns the error details file path, if it exists, or throws
     * an exception, if it does not.
     *
     * @return The error details file path, if it exists.
     *
     * @throws QueryChangeOutputAndErrorSummaryFileException If the option from {@link #findErrorDetailsFile()} is
     * empty.
     * @see #findErrorDetailsFile()
     */
    public Path queryErrorDetailsFile() {
        return this.findErrorDetailsFile().orElseThrow(QueryErrorDetailsFileException::new);
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
     * Writes the provided result to output; this will write two files, one for change output and error summaries and
     * another for error details. After this method has been invoked and returned, both the change output and error
     * summary writer and the error details writer will be closed.
     *
     * @param result The result to write.
     *
     * @throws WriteResultNullException When result is null.
     */
    public final void write(CalculateChangeResult result) {
        if (result == null) {
            this.close();
            throw new WriteResultNullException();
        }
        this.write(Collections.singletonList(result));
    }

    /**
     * Writes the provided result list to output; this will write two files, one for change output and error summaries
     * and another for error details. After this method has been invoked and returned, both the change output and error
     * summary writer and the error details writer will be closed.
     *
     * @param resultList The results list to write.
     *
     * @throws WriteResultListNullException When resultsList is null.
     * @throws WriteResultListEmptyException When resultsList is empty.
     * @throws ModelMapperMapUnsuccessfulResultsToErrorModelException When unsuccessful results can not be mapped to the
     * output model via {@link CurrencyModelMapper}.
     * @throws ErrorDetailsObjectMapperWriteValueException When the error output models can not be written to the error
     * details writer via {@link ObjectWriter#writeValue(Writer, Object)}.
     * @see #writeChangeOutputAndErrorSummaries(CalculateChangeResult)
     */
    public void write(final List<CalculateChangeResult> resultList) {
        if (resultList == null) {
            this.close();
            throw new WriteResultListNullException();
        }
        if (resultList.isEmpty()) {
            this.close();
            throw new WriteResultListEmptyException();
        }

        /* filter a list of unsuccessful results, map them to an output model list, and write the output model list
            to the error details file.
         */
        final List<CalculateChangeResult> unsuccessful = resultList
                .parallelStream()
                .filter(CalculateChangeResult::isNotSuccessful)
                .collect(Collectors.toList());
        final List<CalculateChangeResult.OutputModel> errorsModelList;
        try {
            CurrencyModelMapper currencyModelMapper = SpringContextUtils.getBean(CurrencyModelMapper.class);
            errorsModelList = currencyModelMapper.mapToOutputModel(unsuccessful);
        }
        catch (final Throwable throwable) {
            this.close();
            throw new ModelMapperMapUnsuccessfulResultsToErrorModelException(
                    throwable);
        }
        try {
            final CalculateChangeResultsWriter.OutputModel outputModel =
                    CalculateChangeResultsWriter.OutputModel.create(errorsModelList);
            ObjectMapper jsonObjectMapper = SpringContextUtils.getBean(ObjectMapper.class);
            jsonObjectMapper.writerWithDefaultPrettyPrinter().writeValue(this.errorDetailsWriter, outputModel);
        }
        catch (final Throwable throwable) {
            this.close();
            throw new ErrorDetailsObjectMapperWriteValueException(throwable);
        }

        /* write the change output and error summaries */
        try {
            resultList.forEach(this::writeChangeOutputAndErrorSummaries);
        }
        finally {
            this.close();
        }
    }

    /**
     * Helper method which writes an individual result to the change output and error summary file; error details are
     * written in the {@link #write(List)} method.
     *
     * @param calculateChangeResult The result to write.
     *
     * @throws ErrorDuringWriteOfChangeOutputForSuccessfulResultException When a successful change output can not be
     * written to the change output and error summary writer.
     * @throws ErrorDuringWriteOfErrorSummaryForUnsuccessfulResultException When an unsuccessful error summary can not
     * be written to the change output and error summary writer.
     * @see #write(List)
     */
    private void writeChangeOutputAndErrorSummaries(final CalculateChangeResult calculateChangeResult) {
        final WriterWrapper writerWrapper = SpringContextUtils.getBean(WriterWrapper.class);
        if (calculateChangeResult.isSuccessful()) {
            try {
                final String message = calculateChangeResult.getOutputChangeBag().toString();
                writerWrapper.writeLine(changeOutputAndErrorSummaryWriter, message);
            }
            catch (final Throwable throwable) {
                throw new ErrorDuringWriteOfChangeOutputForSuccessfulResultException(throwable);
            }
        }
        else {
            try {
                final String message = String.format(" E: check errors detail output for UUID: %s", calculateChangeResult.getUuid());
                writerWrapper.writeLine(changeOutputAndErrorSummaryWriter, message);
            }
            catch (final Throwable throwable) {
                throw new ErrorDuringWriteOfErrorSummaryForUnsuccessfulResultException(throwable);
            }
        }
    }

    /**
     * Closes the {@link #changeOutputAndErrorSummaryWriter} and {@link #errorDetailsWriter} of this writer.
     *
     * @throws CompoundException If closing either writer exceptions, then those exceptions will be in the exception
     * collection of the compound exception.
     */
    @Override
    public void close() {
        ExceptionList exceptionList = new ExceptionList();

        try {
            this.changeOutputAndErrorSummaryWriter.close();
        }
        catch (final Throwable throwable) {
            exceptionList.add(throwable);
        }

        try {
            this.errorDetailsWriter.close();
        }
        catch (final Throwable throwable) {
            exceptionList.add(throwable);
        }

        exceptionList.checkAndThrow();
    }

    static final class WriteResultNullException extends RuntimeException {
        WriteResultNullException() {
            super("result must not be null");
        }
    }

    /**
     * See {@link #createTempDirectoryWriter(String, String)}
     *
     * @see #createTempDirectoryWriter(String, String)
     */
    static final class CreateTempDirectoryWriterException extends RuntimeException {
        CreateTempDirectoryWriterException(Throwable cause) {
            super("could not create temp directory writer", cause);
        }
    }

    /**
     * See {@link #write(List)}
     *
     * @see #write(List)
     */
    static final class WriteResultListNullException extends RuntimeException {
        WriteResultListNullException() {
            super("resultList must not be null");
        }
    }

    /**
     * See {@link #write(List)}
     *
     * @see #write(List)
     */
    static final class WriteResultListEmptyException extends RuntimeException {
        WriteResultListEmptyException() {
            super("resultList must not be empty");
        }
    }

    /**
     * See {@link #write(List)}
     *
     * @see #write(List)
     */
    static final class ModelMapperMapUnsuccessfulResultsToErrorModelException extends RuntimeException {
        ModelMapperMapUnsuccessfulResultsToErrorModelException(Throwable cause) {
            super("could not map unsuccessful results to output format", cause);
        }
    }

    /**
     * See {@link #write(List)}
     *
     * @see #write(List)
     */
    static final class ErrorDetailsObjectMapperWriteValueException extends RuntimeException {
        ErrorDetailsObjectMapperWriteValueException(Throwable cause) {
            super("could not write error details", cause);
        }
    }

    /**
     * See {@link #writeChangeOutputAndErrorSummaries(CalculateChangeResult)}
     *
     * @see #writeChangeOutputAndErrorSummaries(CalculateChangeResult)
     */
    static final class ErrorDuringWriteOfChangeOutputForSuccessfulResultException extends RuntimeException {
        ErrorDuringWriteOfChangeOutputForSuccessfulResultException(Throwable cause) {
            super("could not write successful result to change output and error summary writer", cause);
        }
    }

    /**
     * See {@link #writeChangeOutputAndErrorSummaries(CalculateChangeResult)}
     *
     * @see #writeChangeOutputAndErrorSummaries(CalculateChangeResult)
     */
    static final class ErrorDuringWriteOfErrorSummaryForUnsuccessfulResultException extends RuntimeException {
        ErrorDuringWriteOfErrorSummaryForUnsuccessfulResultException(Throwable cause) {
            super("could not write unsuccessful result to output", cause);
        }
    }

    /**
     * See {@link #queryChangeOutputAndErrorSummaryFile()}
     *
     * @see #queryChangeOutputAndErrorSummaryFile()
     */
    static final class QueryChangeOutputAndErrorSummaryFileException extends RuntimeException {
        QueryChangeOutputAndErrorSummaryFileException() {
            super(StringUtils.EMPTY);
        }
    }

    /**
     * See {@link #queryErrorDetailsFile()}
     *
     * @see #queryErrorDetailsFile()
     */
    static final class QueryErrorDetailsFileException extends RuntimeException {
        QueryErrorDetailsFileException() {
            super(StringUtils.EMPTY);
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
