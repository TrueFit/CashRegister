package com.example.cash_register.currency;

import java.io.InputStream;

/**
 * An abstract subclass of {@code InputTranslatorBase}, which takes an arbitrary input and translates it to an {@code
 * InputStream} object, since this a common object to provide to input parsers.
 *
 * @param <TInput> The type of input to provide as an {@code InputStream}. In the tests of this project, this is
 * commonly a {@code String} referring to a file or a resource, which is then provided as an input stream.
 */
public abstract class InputStreamTranslatorBase<TInput> extends InputTranslatorBase<TInput, InputStream> {
    protected InputStreamTranslatorBase() {
        super();
    }
}
