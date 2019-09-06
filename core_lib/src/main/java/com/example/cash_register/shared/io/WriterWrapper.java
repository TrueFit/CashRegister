package com.example.cash_register.shared.io;

import java.io.Writer;

/**
 * Provides wrappers around methods from the {@link Writer} class.
 */
public class WriterWrapper {
    /**
     * Direct wrapper for {@link Writer#write(String)}.
     *
     * @param thisWriter The writer.
     * @param str Per {@link Writer#write(String)}.
     *
     * @throws WriteException If {@link Writer#write(String)} throws an exception, then that exception will be the
     * cause.
     */
    public void write(Writer thisWriter, String str) {
        try {
            thisWriter.write(str);
        }
        catch (final Throwable throwable) {
            throw new WriteException(throwable);
        }
    }

    /**
     * Writes a string, then a new line to the writer.
     *
     * @param thisWriter The writer.
     * @param str The string to write
     *
     * @throws WriteException If {@link #write(Writer, String)} or {@link #newLine(Writer)} throws an exception, then
     * that exception will be the cause.
     */
    public void writeLine(Writer thisWriter, String str) {
        try {
            this.write(thisWriter, str);
            this.newLine(thisWriter);
        }
        catch (final Throwable throwable) {
            throw new WriteLineException(throwable);
        }
    }

    /**
     * Writes a new line to the writer.
     *
     * @param thisWriter The writer.
     *
     * @throws WriteException If {@link #write(Writer, String)} throws an exception, then that exception will be the
     * cause.
     */
    public void newLine(Writer thisWriter) {
        try {
            this.write(thisWriter, System.lineSeparator());
        }
        catch (final Throwable throwable) {
            throw new NewLineException(throwable);
        }
    }

    /**
     * Direct wrapper for {@link Writer#flush()}.
     *
     * @param thisWriter The writer.
     *
     * @throws FlushException If {@link Writer#flush()} throws an exception, then that exception will be the cause.
     */
    public void flush(Writer thisWriter) {
        try {
            thisWriter.flush();
        }
        catch (final Throwable throwable) {
            throw new FlushException(throwable);
        }
    }

    /**
     * See {@link #write(Writer, String)}
     *
     * @see #write(Writer, String)
     */
    public static final class WriteException extends RuntimeException {
        WriteException(Throwable cause) {
            super("could not write string", cause);
        }
    }

    /**
     * See {@link #newLine(Writer)}
     *
     * @see #newLine(Writer)
     */
    public static final class NewLineException extends RuntimeException {
        NewLineException(Throwable cause) {
            super("could not write new line", cause);
        }
    }

    /**
     * See {@link #writeLine(Writer, String)}
     *
     * @see #writeLine(Writer, String)
     */
    public static final class WriteLineException extends RuntimeException {
        WriteLineException(Throwable cause) {
            super("could not write line", cause);
        }
    }

    /**
     * See {@link #flush(Writer)}
     *
     * @see #flush(Writer)
     */
    public static final class FlushException extends RuntimeException {
        FlushException(Throwable cause) {
            super("could not flush", cause);
        }
    }
}
