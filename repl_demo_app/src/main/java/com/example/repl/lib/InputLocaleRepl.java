package com.example.repl.lib;

import com.example.cash_register.currency.CashRegisterProperties;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementation of {@link ReplBase} which processes input locale.
 */
@Component(InputLocaleRepl.QUALIFIER)
class InputLocaleRepl extends ReplBase {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.repl.lib.InputLocaleRepl";
    /**
     * Cash register properties.
     */
    private final CashRegisterProperties cashRegisterProperties;
    /**
     * REPL state.
     */
    private final ReplState replState;

    /**
     * Autowired constructor.
     *
     * @param cashRegisterProperties Cash register properties.
     * @param replState REPL state.
     */
    @Autowired
    protected InputLocaleRepl(
            CashRegisterProperties cashRegisterProperties,
            ReplState replState) {
        super();
        this.cashRegisterProperties = cashRegisterProperties;
        this.replState = replState;
    }

    /**
     * Implementation of {@link ReplBase#doReplImpl()} which processes input locale.
     */
    @Override
    protected void doReplImpl() {
        String message = String.format(
                "Enter input locale language tag [current: %s] -> ",
                this.cashRegisterProperties.getInputLocale().toLanguageTag());
        this.write(message);
        this.flush();

        String input = this.readLine();
        if (StringUtils.isBlank(input)) {
            return;
        }
        this.replState.setInputLocaleLanguageTag(input);
    }
}
