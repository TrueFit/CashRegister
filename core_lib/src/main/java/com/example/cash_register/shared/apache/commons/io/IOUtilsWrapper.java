package com.example.cash_register.shared.apache.commons.io;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.io.IOUtils;

import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;


/**
 * Provides wrappers around methods from the {@link IOUtils} class.
 */
@NoArgsConstructor(access = AccessLevel.PACKAGE)
public class IOUtilsWrapper {
    /**
     * Direct wrapper around {@link IOUtils#toString(InputStream, Charset)}.
     *
     * @param inputStream Per {@link IOUtils#toString(InputStream, Charset)}.
     * @param charset Per {@link IOUtils#toString(InputStream, Charset)}.
     *
     * @throws ToStringWithInputStreamAndCharsetException If {@link IOUtils#toString(InputStream, Charset)} throws an
     * exception, that exception will be the cause.
     */
    public final String toString(final InputStream inputStream, Charset charset) {
        try {
            return IOUtils.toString(inputStream, charset);
        }
        catch (final Throwable throwable) {
            String message = String.format(
                    "could not convert input stream to string.  Charset => %s",
                    charset);
            throw new ToStringWithInputStreamAndCharsetException(message, throwable);
        }
    }

    /**
     * Direct wrapper around {@link IOUtils#copy(InputStream, OutputStream)}.
     *
     * @param inputStream Per {@link IOUtils#copy(InputStream, OutputStream)}.
     * @param outputStream Per {@link IOUtils#copy(InputStream, OutputStream)}.
     *
     * @throws CopyWithInputStreamAndOutputStreamException If {@link IOUtils#copy(InputStream, OutputStream)} throws an
     * exception, that exception will be the cause.
     */
    public void copy(final InputStream inputStream, final OutputStream outputStream) {
        try {
            IOUtils.copy(inputStream, outputStream);
        }
        catch (final Throwable throwable) {
            throw new CopyWithInputStreamAndOutputStreamException(throwable);
        }
    }

    /**
     * See {@link #toString(InputStream, Charset)}
     *
     * @see #toString(InputStream, Charset)
     */
    public static final class ToStringWithInputStreamAndCharsetException extends RuntimeException {
        ToStringWithInputStreamAndCharsetException(String message, Throwable throwable) {
            super(message, throwable);
        }
    }

    /**
     * See {@link #copy(InputStream, OutputStream)}
     *
     * @see #copy(InputStream, OutputStream)
     */
    public static final class CopyWithInputStreamAndOutputStreamException extends RuntimeException {
        CopyWithInputStreamAndOutputStreamException(final Throwable cause) {
            super("could not copy inputStream to outputStream", cause);
        }
    }
}
