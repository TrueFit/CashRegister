package com.example.tango.demo.lib;

import lombok.AccessLevel;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.file.Path;


/**
 * Base class for input file processing.
 *
 * @see TangoInputFileProcessor
 * @see JsonInputFileProcessor
 */
@Component /* abstract */
@Getter(AccessLevel.PACKAGE)
abstract class InputFileProcessorBase {
    /**
     * Temp directory.
     */
    @Autowired
    private TempDirComponent tempDirComponent;

    /**
     * Subclasses must implement this method to process the provided file.
     *
     * @param inputFile The file to process.
     */
    abstract void processInputFile(Path inputFile);
}
