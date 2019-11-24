package com.example.repl.lib;

import com.example.cash_register.shared.io.WriterWrapper;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.io.Writer;
import java.util.Scanner;

/**
 * Helper component for REPL input and output.
 */
@Getter(AccessLevel.PACKAGE)
@Component
class ReplInputOutput {
    /**
     * See {@link WriterWrapper}.
     */
    private final WriterWrapper writerWrapper;
    /**
     * The {@link Scanner} for processing input.
     */
    private final Scanner scanner;
    /**
     * The {@link BufferedWriter} for processing output.
     */
    private final BufferedWriter outputWriter;

    /**
     * Autowired constructor.
     *
     * @param writerWrapper See {@link WriterWrapper}.
     * @param scanner The {@link Scanner} for processing input.
     * @param outputWriter The {@link BufferedWriter} for processing output.
     */
    @Autowired
    ReplInputOutput(
            final WriterWrapper writerWrapper,
            final Scanner scanner,
            final BufferedWriter outputWriter) {
        super();
        this.writerWrapper = writerWrapper;
        this.scanner = scanner;
        this.outputWriter = outputWriter;
    }

    /**
     * Reads a line.
     *
     * @return The string that was read.
     *
     * @see #checkExit(String)
     */
    String readLine() {
        final String line = this.scanner.nextLine();
        this.checkExit(line);
        return line;
    }

    /**
     * Writes the provided string to the output writer.
     *
     * @param str The string to write.
     *
     * @see WriterWrapper#write(Writer, String)
     * @see #outputWriter
     */
    void write(final String str) {
        this.writerWrapper.write(this.outputWriter, str);
    }

    /**
     * Writes the provided line to the output writer followed by a new line.
     *
     * @param line The line to write.
     *
     * @see WriterWrapper#writeLine(Writer, String)
     * @see #outputWriter
     */
    void writeLine(final String line) {
        this.writerWrapper.writeLine(this.outputWriter, line);
    }

    /**
     * Writes a new line to the output writer.
     *
     * @see WriterWrapper#newLine(Writer)
     * @see #outputWriter
     */
    void newLine() {
        this.writerWrapper.newLine(this.outputWriter);
    }

    /**
     * Flushes the output writer.
     *
     * @see WriterWrapper#flush(Writer)
     * @see #outputWriter
     */
    void flush() {
        this.writerWrapper.flush(this.outputWriter);
    }

    /**
     * If the provided string equals {@code "/exit"}, then throw an {@link ExitInterruptException} to exit the program.
     *
     * @param input The input to check.
     *
     * @throws ExitInterruptException Intentionally, to exit the program and go back to the Spring Shell.
     */
    private void checkExit(final String input) {
        if (StringUtils.equals("/exit", input)) {
            throw new ExitInterruptException();
        }
    }

    /**
     * See {@link #checkExit(String)}
     *
     * @see #checkExit(String)
     */
    static final class ExitInterruptException extends RuntimeException {

    }
}
