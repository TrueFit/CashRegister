package com.example.cash_register.currency;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring beans for the currency model mapper.
 *
 * @see CurrencyModelMapper
 */
@Configuration
@NoArgsConstructor(access = AccessLevel.PACKAGE)
class CurrencyModelMapperConfig {
    static final String QUALIFIER_CURRENCY_MODEL_MAPPER =
            "com.example.cash_register.currency.CurrencyModelMapperConfig.currencyModelMapper";

    /**
     * The currency model mapper bean.
     *
     * @return The currency model mapper bean.
     */
    @Bean(QUALIFIER_CURRENCY_MODEL_MAPPER)
    CurrencyModelMapper currencyModelMapper() {
        return new CurrencyModelMapper();
    }
}
