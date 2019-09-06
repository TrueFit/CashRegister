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
 * Base class for REPL functionality.
 */
@Getter(AccessLevel.PACKAGE)
@Component /* abstract */
abstract class ReplBase {
    @Autowired
    private WriterWrapper writerWrapper;
    @Autowired
    private Scanner scanner;
    @Autowired
    private BufferedWriter outputWriter;

    ReplBase() {
        super();
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
     */
    void writeLine(final String line) {
        this.writerWrapper.writeLine(this.outputWriter, line);
    }

    /**
     * Flushes the output writer.
     *
     * @see WriterWrapper#flush(Writer)
     */
    void flush() {
        this.writerWrapper.flush(this.outputWriter);
    }

    /**
     * If the provide string equals {@code "/exit"}, then throw an {@link ExitInterruptException} to exit the program.
     *
     * @param input The input to check.
     *
     * @throws ExitInterruptException Intentionally, to exit the program and go back to {@code jshell}.
     */
    private void checkExit(final String input) {
        if (StringUtils.equals("/exit", input)) {
            throw new ExitInterruptException();
        }
    }

    /**
     * Starts the REPL loop.
     */
    public final void doRepl() {
        this.doReplImpl();
    }

    /**
     * Subclasses must implement this method, which will run their own REPL loops.
     */
    protected abstract void doReplImpl();

    /**
     * See {@link #checkExit(String)}
     *
     * @see #checkExit(String)
     */
    static final class ExitInterruptException extends RuntimeException {

    }
}
