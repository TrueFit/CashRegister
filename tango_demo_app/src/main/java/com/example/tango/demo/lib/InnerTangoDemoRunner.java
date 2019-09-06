package com.example.tango.demo.lib;

import com.example.cash_register.shared.resources.SpringResourceUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Internal run methods for this application.
 */
@Component(InnerTangoDemoRunner.QUALIFIER)
public class InnerTangoDemoRunner {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.tango.demo.lib.InnerTangoDemoRunner";
    /**
     * Tango input file processor.
     */
    @Autowired
    private TangoInputFileProcessor tangoInputFileProcessor;
    /**
     * Json input file processor.
     */
    @Autowired
    private JsonInputFileProcessor jsonInputFileProcessor;

    /**
     * File chooser.
     */
    @Autowired
    private FileChooser fileChooser;

    /**
     * Spring resource utils.
     */
    @Autowired
    private SpringResourceUtils springResourceUtils;

    /**
     * Copies various input files to a temp directory and starts a file chooser to pick an input file, which then is
     * processed via change calculator and the results displayed; files which end with {@code ".json"} will be processed
     * via {@link JsonInputFileProcessor}; all other files will be processed via {@link TangoInputFileProcessor}.
     *
     * @param args The application arguments passed to this spring boot application.
     *
     * @see JsonInputFileProcessor
     * @see TangoInputFileProcessor
     */
    public final void runImpl(ApplicationArguments args) {
        Path newTempDirectory = null;
        Path inputFile = null;
        final List<String> inputFileOptionValueList = args.getOptionValues("inputFile");
        if (CollectionUtils.isNotEmpty(inputFileOptionValueList)) {
            if (inputFileOptionValueList.size() != 1) {
                throw new MultipleInputFileArgumentsProvidedException();
            }
            inputFile = Paths.get(inputFileOptionValueList.get(0));
        }
        try {
            if (inputFile == null) {
                newTempDirectory = this.springResourceUtils.copyLocationPatternArrayToTempDir(
                        "/com/example/tango/input/**/*.txt",
                        "/com/example/cash_register/currency/sample_input/**/*.json");
                inputFile = this.fileChooser.chooseFile(newTempDirectory);
                if (inputFile == null) {
                    throw new InputFileNullException();
                }
            }
            if (Files.notExists(inputFile)) {
                final String message = String.format(
                        "chosen file does not exist: %s",
                        inputFile.toAbsolutePath().toString());
                throw new InputFileDoesNotExistException(message);
            }

            if (inputFile.toString().endsWith(".json")) {
                this.jsonInputFileProcessor.processInputFile(inputFile);
            }
            else {
                this.tangoInputFileProcessor.processInputFile(inputFile);
            }
        }
        catch (final Throwable throwable) {
            throw new InnerTangoDemoRunnerException(throwable);
        }
        finally {
            if (newTempDirectory != null) {
                FileUtils.deleteQuietly(newTempDirectory.toFile());
            }
        }
    }

    public static final class MultipleInputFileArgumentsProvidedException extends RuntimeException {
        private MultipleInputFileArgumentsProvidedException() {
            super("only one input file argument may be provided");
        }
    }

    public static final class InputFileDoesNotExistException extends RuntimeException {
        private InputFileDoesNotExistException(String message) {
            super(message);
        }
    }

    public static final class InputFileNullException extends RuntimeException {
        private InputFileNullException() {
            super("input file is null");
        }
    }

    public static final class InnerTangoDemoRunnerException extends RuntimeException {
        private InnerTangoDemoRunnerException(Throwable cause) {
            super(cause);
        }
    }
}
