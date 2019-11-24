package com.example.repl.lib;

import lombok.AccessLevel;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Base class for REPL functionality.
 */
@Getter(AccessLevel.PACKAGE)
@Component /* abstract */
abstract class ReplBase {
    @Autowired
    private ReplInputOutput replInputOutput;

    ReplBase() {
        super();
    }

    /**
     * Direct wrapper around {@link ReplInputOutput#readLine()}.
     *
     * @return Per {@link ReplInputOutput#readLine()}
     */
    String readLine() {
        return this.replInputOutput.readLine();
    }

    /**
     * Direct wrapper around {@link ReplInputOutput#write(String)}.
     *
     * @param str Per {@link ReplInputOutput#write(String)}.
     */
    void write(final String str) {
        this.replInputOutput.write(str);
    }

    /**
     * Direct wrapper around {@link ReplInputOutput#writeLine(String)}.
     *
     * @param line Per {@link ReplInputOutput#writeLine(String)}.
     */
    void writeLine(final String line) {
        this.replInputOutput.writeLine(line);
    }

    /**
     * Direct wrapper around {@link ReplInputOutput#newLine()}.
     */
    void newLine() {
        this.replInputOutput.newLine();
    }

    /**
     * Direct wrapper around {@link ReplInputOutput#flush()}.
     */
    void flush() {
        this.replInputOutput.flush();
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
}
