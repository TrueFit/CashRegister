package com.example.repl.lib;

import com.example.cash_register.currency.CalculateChangeArgs;
import com.example.cash_register.currency.InputParserBase;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * Implementation of {@link InputParserBase<ReplState>}, which parses a {@link ReplState} object into an calculate
 * change args object.
 */
@Component
class InputParserReplState extends InputParserBase<ReplState> {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.repl.lib.InputParserReplState";

    /**
     * Parses the {@link ReplState} object into a {@link CalculateChangeArgs}.
     *
     * @param replState The REPL state.
     *
     * @return The list of calculate change args, which in this instance will contain only one object.
     */
    @Override
    protected List<CalculateChangeArgs> parseImpl(final ReplState replState) {
        CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(replState.getOwed())
                .tendered(replState.getTendered())
                .build();
        return Collections.singletonList(args);
    }
}
