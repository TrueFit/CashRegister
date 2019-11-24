package com.example.tango.demo.lib;

import lombok.Builder;
import lombok.Getter;

import java.nio.file.Path;

/**
 * Args used to create an output JFrame.
 */
@Builder
@Getter
class CreateOutputFrameArgs {
    private Path inputFile;
    private Path outputFile;
    private Path errorFile;
}
