package com.example.cash_register.currency;

import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Path;

/**
 * Translates a Java {@link Path} object to an input stream.
 */
@Component(InputStreamTranslatorPath.QUALIFIER)
public class InputStreamTranslatorPath extends InputStreamTranslatorBase<Path> {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.InputStreamTranslatorPath";

    /**
     * Translates the path to an input stream.
     *
     * @param path The path.
     *
     * @return The input stream.
     *
     * @throws TranslateInputPathException When the path can not be converted to an input stream; the cause will be the
     * exception thrown by {@link Files#newInputStream(Path, OpenOption...)}.
     * @see Files#newInputStream(Path, OpenOption...)
     */
    @Override
    protected InputStream translateImpl(final Path path) {
        try {
            return Files.newInputStream(path);
        }
        catch (final Throwable throwable) {
            final String message = "could not create file input stream";
            throw new TranslateInputPathException(throwable);
        }
    }

    /**
     * See {@link #translateImpl(Path)}
     *
     * @see #translateImpl(Path)
     */
    public static final class TranslateInputPathException extends CashRegisterException {
        TranslateInputPathException(Throwable cause) {
            super("could not create file input stream", cause);
        }
    }
}
