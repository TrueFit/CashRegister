package com.example.cash_register.currency;

import java.io.InputStream;

/**
 * An abstract subclass of {@link InputParserBase} which takes an {@link InputStream} object as input, since this is a
 * common object to parse.
 *
 * @see InputParserBase
 */
public abstract class InputStreamParserBase extends InputParserBase<InputStream> {
    protected InputStreamParserBase() {
        super();
    }
}
