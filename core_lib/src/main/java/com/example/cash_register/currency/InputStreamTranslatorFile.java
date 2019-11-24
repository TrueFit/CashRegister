package com.example.cash_register.currency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.InputStream;

/**
 * Translates a Java {@link File} object to an input stream.
 */
@Component(InputStreamTranslatorFile.QUALIFIER)
public class InputStreamTranslatorFile extends InputStreamTranslatorBase<File> {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.InputStreamTranslatorFile";
    /**
     * See {@link InputStreamTranslatorPath}.
     */
    private final InputStreamTranslatorPath inputStreamTranslatorPath;

    /**
     * Autowired constructor.
     *
     * @param inputStreamTranslatorPath See {@link InputStreamTranslatorPath}.
     */
    @Autowired
    private InputStreamTranslatorFile(final InputStreamTranslatorPath inputStreamTranslatorPath) {
        this.inputStreamTranslatorPath = inputStreamTranslatorPath;
    }

    /**
     * Translates the file to an input stream.
     *
     * @param file The file to translate to an input stream.
     *
     * @return The input stream.
     *
     * @throws FileNullException When file is null.
     */
    @Override
    protected InputStream translateImpl(final File file) {
        if (file == null) {
            throw new FileNullException();
        }
        return this.inputStreamTranslatorPath.translate(file.toPath());
    }

    /**
     * See {@link #translateImpl(File)}
     *
     * @see #translateImpl(File)
     */
    public final static class FileNullException extends CashRegisterException {
        FileNullException() {
            super("file must not be null");
        }
    }
}
