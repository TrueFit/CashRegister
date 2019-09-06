package com.example.repl.lib;

import com.example.cash_register.currency.PhysicalSetMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Currency;

/**
 * Implementation of {@link ReplBase} which processes currency.
 */
@Component(CurrencyRepl.QUALIFIER)
class CurrencyRepl extends ReplBase {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.repl.lib.CurrencyRepl";
    /**
     * Physical set map
     *
     * @see PhysicalSetMap
     */
    private final PhysicalSetMap physicalSetMap;
    /**
     * REPL state
     *
     * @see ReplState
     */
    private final ReplState replState;

    /**
     * Autowired constructor
     *
     * @param physicalSetMap Physical set map
     * @param replState REPL state
     */
    @Autowired
    protected CurrencyRepl(
            PhysicalSetMap physicalSetMap,
            ReplState replState) {
        super();
        this.physicalSetMap = physicalSetMap;
        this.replState = replState;
    }

    /**
     * Implementation of {@link ReplBase#doReplImpl()} which processes currency.
     */
    @Override
    protected void doReplImpl() {
        String message = String.format(
                "Enter currency code [current: %s] -> ",
                this.replState.getCurrency());
        this.write(message);
        this.flush();

        String input = this.readLine();
        if (StringUtils.isBlank(input)) {
            return;
        }
        Currency currency = Currency.getInstance(input);
        this.physicalSetMap.checkRepresentation(currency);
        this.replState.setCurrency(currency);
    }
}
