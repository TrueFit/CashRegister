package com.example.cash_register.shared.io;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;

import java.io.BufferedWriter;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Path;
import java.nio.file.attribute.FileAttribute;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Provides wrappers around methods from the {@link Files} class.
 */
@NoArgsConstructor(access = AccessLevel.PACKAGE)
public class FilesWrapper {
    /**
     * Creates a temp directory with random prefix.
     *
     * @return The temp directory.
     */
    public final Path createTempDir() {
        int randomInt = ThreadLocalRandom.current().nextInt(5, 15);
        String prefix = RandomStringUtils.randomAlphabetic(randomInt);
        return this.createTempDir(prefix);
    }

    /**
     * Creates a temp file with random prefix and random suffix.
     *
     * @return The temp file.
     */
    public final Path createTempFile() {
        int randomInt = ThreadLocalRandom.current().nextInt(5, 15);
        String prefix = RandomStringUtils.randomAlphabetic(randomInt);
        String suffix = RandomStringUtils.randomAlphabetic(randomInt);
        return this.createTempFile(prefix, suffix);
    }

    /**
     * Direct wrapper around {@link Files#createTempFile(String, String, FileAttribute[])}.
     *
     * @param prefix Per {@link Files#createTempFile(String, String, FileAttribute[])}.
     * @param suffix Per {@link Files#createTempFile(String, String, FileAttribute[])}.
     * @param attrs Per {@link Files#createTempFile(String, String, FileAttribute[])}.
     *
     * @return Per {@link Files#createTempFile(String, String, FileAttribute[])}.
     *
     * @throws CreateTempFileException If {@link Files#createTempFile(String, String, FileAttribute[])} throws an
     * exception, that exception will be the cause.
     */
    public final Path createTempFile(String prefix, String suffix, FileAttribute<?>... attrs) {
        try {
            return Files.createTempFile(prefix, suffix, attrs);
        }
        catch (final Throwable throwable) {
            throw new CreateTempFileException(throwable);
        }
    }

    /**
     * Direct wrapper around {@link Files#createTempDirectory(String, FileAttribute[])}.
     *
     * @param prefix Per {@link Files#createTempDirectory(String, FileAttribute[])}.
     * @param attrs Per {@link Files#createTempDirectory(String, FileAttribute[])}.
     *
     * @return Per {@link Files#createTempDirectory(String, FileAttribute[])}.
     *
     * @throws CreateTempDirException If {@link Files#createTempDirectory(String, FileAttribute[])}. throws an
     * exception, that exception will be the cause.
     */
    public final Path createTempDir(String prefix, FileAttribute<?>... attrs) {
        try {
            return Files.createTempDirectory(prefix, attrs);
        }
        catch (final Throwable throwable) {
            throw new CreateTempDirException(throwable);
        }
    }

    /**
     * Direct wrapper around {@link Files#newBufferedWriter(Path, Charset, OpenOption...)}.
     *
     * @param path Per {@link Files#newBufferedWriter(Path, Charset, OpenOption...)}.
     * @param options Per {@link Files#newBufferedWriter(Path, Charset, OpenOption...)}.
     *
     * @return A buffered writer
     *
     * @throws NewBufferedWriterWrapperException If {@link Files#newBufferedWriter(Path, Charset, OpenOption...)} throws
     * an exception; that exception will be the cause.
     * @see Files#newBufferedWriter(Path, Charset, OpenOption...)
     */
    public final BufferedWriter newBufferedWriter(Path path, OpenOption... options) {
        try {
            return Files.newBufferedWriter(path, StandardCharsets.UTF_8, options);
        }
        catch (final Throwable throwable) {
            throw new NewBufferedWriterWrapperException(throwable);
        }
    }

    /**
     * Direct wrapper around {@link Files#readString(Path)}.
     *
     * @param path Per {@link Files#readString(Path)}.
     *
     * @return The string, per {@link Files#readString(Path)}.
     *
     * @throws ReadStringException If {@link Files#readString(Path)} throws an exception, that exception will be the
     * cause.
     * @see Files#readString(Path)
     */
    public final String readString(Path path) {
        try {
            return Files.readString(path);
        }
        catch (final Throwable throwable) {
            throw new ReadStringException(throwable);
        }
    }

    /**
     * See {@link #createTempFile(String, String, FileAttribute[])}
     *
     * @see #createTempFile(String, String, FileAttribute[])
     */
    static final class CreateTempFileException extends RuntimeException {
        CreateTempFileException(Throwable cause) {
            super("could not create temp file", cause);
        }
    }

    /**
     * See {@link #newBufferedWriter(Path, OpenOption...)}
     *
     * @see #newBufferedWriter(Path, OpenOption...)
     */
    static final class NewBufferedWriterWrapperException extends RuntimeException {
        NewBufferedWriterWrapperException(Throwable cause) {
            super("could not create buffered writer", cause);
        }
    }

    /**
     * See {@link #createTempDir(String, FileAttribute[])}
     *
     * @see #createTempDir(String, FileAttribute[])
     */
    static final class CreateTempDirException extends RuntimeException {
        CreateTempDirException(Throwable cause) {
            super("could not create temp directory", cause);
        }
    }

    /**
     * See {@link #readString(Path)}
     *
     * @see #readString(Path)
     */
    static final class ReadStringException extends RuntimeException {
        ReadStringException(Throwable cause) {
            super("could not read string from file", cause);
        }
    }
}
