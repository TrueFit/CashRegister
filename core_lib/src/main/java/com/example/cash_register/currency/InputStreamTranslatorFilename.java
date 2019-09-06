package com.example.cash_register.currency;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.Path;

/**
 * Translates a filename to an input stream.
 *
 * @see InputStreamTranslatorPath
 */
@Component(InputStreamTranslatorFilename.QUALIFIER)
public class InputStreamTranslatorFilename extends InputStreamTranslatorBase<String> {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.InputStreamTranslatorFilename";
    /**
     * Input translator.
     *
     * @see InputStreamTranslatorPath
     */
    @Autowired
    private InputStreamTranslatorPath inputStreamTranslatorPath;

    /**
     * Takes the filename, and translates the file to an input stream.
     *
     * @param filename The filename.
     *
     * @return The input stream.
     *
     * @throws FilenameIsBlankException When filename is null, empty, or whitespace.
     * @see InputStreamTranslatorPath#translate(Object)
     */
    @Override
    protected InputStream translateImpl(String filename) {
        if (StringUtils.isBlank(filename)) {
            throw new FilenameIsBlankException();
        }
        return this.inputStreamTranslatorPath.translate(Path.of(filename));
    }

    /**
     * See {@link #translateImpl(String)}
     *
     * @see #translateImpl(String)
     */
    public static final class FilenameIsBlankException extends CashRegisterException {
        FilenameIsBlankException() {
            super("filename must not be null, empty, or whitespace");
        }
    }
}
