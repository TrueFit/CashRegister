package com.example.repl.lib;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementation of {@link ReplBase} which processes owed value.
 */
@Component(OwedRepl.QUALIFIER)
class OwedRepl extends ReplBase {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.repl.lib.OwedRepl";
    /**
     * REPL state.
     */
    private final ReplState replState;

    /**
     * Autowired constructor.
     *
     * @param replState REPL state.
     */
    @Autowired
    protected OwedRepl(ReplState replState) {
        super();
        this.replState = replState;
    }

    /**
     * Implementation of {@link ReplBase#doReplImpl()} which processes owed value.
     */
    @Override
    protected void doReplImpl() {
        while (true) {
            final String message = String.format(
                    "Enter owed value [input locale: %s, currency: %s] -> ",
                    this.replState.getInputLocale().toLanguageTag(),
                    this.replState.getCurrency());
            this.write(message);
            this.flush();

            String input = this.readLine();
            if (StringUtils.isBlank(input)) {
                continue;
            }
            this.replState.setOwed(input);
            return;
        }
    }
}
