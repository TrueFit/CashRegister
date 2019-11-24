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
     * See {@link PhysicalSetMap}
     */
    private final PhysicalSetMap physicalSetMap;
    /**
     * See {@link ReplState}
     */
    private final ReplState replState;

    /**
     * Autowired constructor
     *
     * @param physicalSetMap See {@link PhysicalSetMap}
     * @param replState See {@link ReplState}
     */
    @Autowired
    protected CurrencyRepl(
            final PhysicalSetMap physicalSetMap,
            final ReplState replState) {
        super();
        this.physicalSetMap = physicalSetMap;
        this.replState = replState;
    }

    /**
     * Implementation of {@link ReplBase#doReplImpl()} which processes currency.
     */
    @Override
    protected void doReplImpl() {
        final String message = String.format(
                "Enter currency code [current: %s] -> ",
                this.replState.getCurrency());
        this.write(message);
        this.flush();

        final String input = this.readLine();
        if (StringUtils.isBlank(input)) {
            return;
        }
        Currency currency = Currency.getInstance(input);
        this.physicalSetMap.checkRepresentation(currency);
        this.replState.setCurrency(currency);
    }
}
