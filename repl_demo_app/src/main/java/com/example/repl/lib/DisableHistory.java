package com.example.repl.lib;

import org.jline.reader.impl.history.DefaultHistory;
import org.springframework.stereotype.Component;

/**
 * Prevent the creation of {@code `spring-shell.log`} files.
 */
@Component(DisableHistory.QUALIFIER)
class DisableHistory extends DefaultHistory {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.repl.lib.DisableHistory";

    /**
     * Intentionally does nothing.
     */
    @SuppressWarnings("EmptyMethod")
    @Override
    public void save() {
    }
}