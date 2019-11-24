package com.example.cash_register.shared.resources;

import com.example.cash_register.shared.apache.commons.io.IOUtilsWrapper;
import com.example.cash_register.shared.io.FilesWrapper;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.text.TextStringBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;

/**
 * Utilities for working with Spring {@link Resource} objects.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component(SpringResourceUtils.QUALIFIER)
public class SpringResourceUtils {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.shared.resources.SpringResourceUtils";
    /**
     * Shared {@link ResourcePatternResolver}.
     *
     * @see ResourcePatternResolver
     */
    private static final ResourcePatternResolver RESOURCE_PATTERN_RESOLVER = new PathMatchingResourcePatternResolver();

    /**
     * See {@link FilesWrapper}.
     */
    @Autowired
    private final FilesWrapper filesWrapper;
    /**
     * See {@link IOUtilsWrapper}.
     */
    @Autowired
    private final IOUtilsWrapper ioUtilsWrapper;
    /**
     * See {@link ResourceStringValidator}.
     */
    @Autowired
    private final ResourceStringValidator resourceStringValidator;

    /**
     * Autowired constructor.
     *
     * @param filesWrapper See {@link FilesWrapper}.
     * @param ioUtilsWrapper See {@link IOUtilsWrapper}.
     * @param resourceStringValidator See {@link ResourceStringValidator}.
     */
    private SpringResourceUtils(
            final FilesWrapper filesWrapper,
            final IOUtilsWrapper ioUtilsWrapper,
            final ResourceStringValidator resourceStringValidator) {
        this.filesWrapper = filesWrapper;
        this.ioUtilsWrapper = ioUtilsWrapper;
        this.resourceStringValidator = resourceStringValidator;
    }

    /**
     * Gets an array of Spring resources given a location pattern and resource pattern resolver.
     *
     * @param locationPattern Per {@link ResourcePatternResolver#getResources(String)}.
     * @param resourcePatternResolver The {@link ResourcePatternResolver} instance used to call
     * {@link ResourcePatternResolver#getResources(String)}
     *
     * @return Per {@link ResourcePatternResolver#getResources(String)}
     *
     * @throws GetSpringResourcesByLocationPatternException If {@link ResourcePatternResolver#getResources(String)}
     * throws an exception, that exception will be the cause.
     * @see ResourceStringValidator#checkResourceString(String)
     * @see ResourcePatternResolver
     */
    public final Resource[] getSpringResources(final String locationPattern, final ResourcePatternResolver resourcePatternResolver) {
        this.resourceStringValidator.checkResourceString(locationPattern);
        try {
            final Resource[] resources = resourcePatternResolver.getResources(locationPattern);
            return resources;
        }
        catch (final Throwable throwable) {
            final String message = String.format(
                    "could not get Spring resources via location pattern:  %s",
                    locationPattern);
            throw new GetSpringResourcesByLocationPatternException(message, throwable);
        }
    }

    /**
     * Gets an array of Spring resources given a location pattern and {@link #RESOURCE_PATTERN_RESOLVER}.
     *
     * @param locationPattern Per {@link #getSpringResources(String, ResourcePatternResolver)}.
     *
     * @return Per {@link #getSpringResources(String, ResourcePatternResolver)}
     *
     * @see #getSpringResources(String, ResourcePatternResolver)
     */
    public final Resource[] getSpringResources(final String locationPattern) {
        return this.getSpringResources(locationPattern, RESOURCE_PATTERN_RESOLVER);
    }

    /**
     * Gets a Spring resource given a location and resource loader.
     *
     * @param location Per {@link ResourceLoader#getResource(String)}
     * @param resourceLoader The resource loader.
     *
     * @return Per {@link ResourceLoader#getResource(String)}.
     *
     * @see ResourceStringValidator#checkResourceString(String)
     * @see ResourceLoader
     */
    public final Resource getSpringResource(final String location, final ResourceLoader resourceLoader) {
        this.resourceStringValidator.checkResourceString(location);
        final Resource resource = resourceLoader.getResource(location);
        return resource;
    }

    /**
     * Gets a Spring resource given a location using {@link #RESOURCE_PATTERN_RESOLVER}.
     *
     * @param location Per {@link #getSpringResource(String, ResourceLoader)}
     *
     * @return Per {@link #getSpringResource(String, ResourceLoader)}.
     *
     * @see #getSpringResource(String, ResourceLoader)
     */
    public final Resource getSpringResource(final String location) {
        return this.getSpringResource(location, RESOURCE_PATTERN_RESOLVER);
    }

    /**
     * Copies the spring resource location to the system temp directory.
     *
     * @param location The spring resource location to copy.
     *
     * @return The newly created file.
     *
     * @see #copyResourceToDir(Path, Resource)
     * @see #getSpringResource(String)
     */
    public final Path copyLocationToSystemTempDir(final String location) {
        final Resource resource = this.getSpringResource(location);
        final Path systemTempDirectory = FileUtils.getTempDirectory().toPath();
        return this.copyResourceToDir(systemTempDirectory, resource);
    }

    /**
     * Copies the Spring resource to the specified target directory
     *
     * @param target The target directory.
     * @param resource The resource to copy.
     *
     * @return The path to the copy of the resource.
     *
     * @throws CopyResourceToDirIOUtilsCopyException When {@link IOUtilsWrapper#copy(InputStream, OutputStream)}
     * exceptions, that exception will be the cause.
     * @throws CopyResourceToDirNullTargetException If {@code target} is null.
     * @throws CopyResourceToDirTargetDoesNotExistException If {@code target} does not exist.
     * @throws CopyResourceToDirNullResourceException If {@code resource} is null.
     * @throws CopyResourceToDirResourceDoesNotExistException If {@code resource} does not exist.
     * @throws CopyResourceToDirResourceNullFilenameException If {@code resource.getFilename()} is null.
     * @see IOUtilsWrapper#copy(InputStream, OutputStream)
     */
    private Path copyResourceToDir(final Path target, final Resource resource) {
        if (target == null) {
            throw new CopyResourceToDirNullTargetException();
        }
        if (Files.notExists(target)) {
            throw new CopyResourceToDirTargetDoesNotExistException();
        }
        if (resource == null) {
            throw new CopyResourceToDirNullResourceException();
        }
        if (! resource.exists()) {
            throw new CopyResourceToDirResourceDoesNotExistException();
        }
        if (resource.getFilename() == null) {
            throw new CopyResourceToDirResourceNullFilenameException();
        }

        final String filename = resource.getFilename();
        final Path outputFile = target.resolve(filename);
        try (
                final InputStream inputStream = resource.getInputStream();
                final OutputStream outputStream = Files.newOutputStream(outputFile)) {
            this.ioUtilsWrapper.copy(inputStream, outputStream);
            return outputFile;
        }
        catch (final Throwable throwable) {
            FileUtils.deleteQuietly(outputFile.toFile());
            throw new CopyResourceToDirIOUtilsCopyException(throwable);
        }
    }

    /**
     * Copies the resources represented by the given location patterns to a new temporary directory.
     *
     * @param locationPatternArray The array of location patterns.
     *
     * @return The path to the newly created temporary directory.
     *
     * @throws CopyLocationPatternToTempDirLocationPatternArrayNullException If {@code locationPatternArray} is null.
     * @throws CopyLocationPatternToTempDirLocationPatternArrayEmptyException If {@code locationPatternArray} is empty.
     * @throws CopyLocationPatternToTempDirException If any calls to {@link #copyResourceToDir(Path, Resource)}
     * exception, then that exception will be the cause.
     * @see #copyResourceToDir(Path, Resource)
     * @see #getSpringResources(String)
     */
    public Path copyLocationPatternArrayToTempDir(final String... locationPatternArray) {
        if (locationPatternArray == null) {
            throw new CopyLocationPatternToTempDirLocationPatternArrayNullException();
        }
        if (ArrayUtils.isEmpty(locationPatternArray)) {
            throw new CopyLocationPatternToTempDirLocationPatternArrayEmptyException();
        }

        final Path newTempDir = this.filesWrapper.createTempDir();
        try {
            for (final String locationPattern : locationPatternArray) {
                final Resource[] resourceArray = this.getSpringResources(locationPattern);
                for (final Resource resource : resourceArray) {
                    this.copyResourceToDir(newTempDir, resource);
                }
            }
        }
        catch (final Throwable throwable) {
            FileUtils.deleteQuietly(newTempDir.toFile());
            final String message = new TextStringBuilder()
                    .appendln("could not copy resources from location pattern array to temp directory")
                    .append("  location pattern array => ").appendln(Arrays.toString(locationPatternArray))
                    .build();
            throw new CopyLocationPatternToTempDirException(message, throwable);
        }
        return newTempDir;
    }

    /**
     * See {@link SpringResourceUtils#copyLocationPatternArrayToTempDir(java.lang.String...)}
     *
     * @see SpringResourceUtils#copyLocationPatternArrayToTempDir(java.lang.String...)
     */
    public static final class CopyLocationPatternToTempDirException extends RuntimeException {
        private CopyLocationPatternToTempDirException(final String message, final Throwable cause) {
            super(message, cause);
        }
    }

    /**
     * See {@link SpringResourceUtils#copyLocationPatternArrayToTempDir(java.lang.String...)}
     *
     * @see SpringResourceUtils#copyLocationPatternArrayToTempDir(java.lang.String...)
     */
    public static final class CopyLocationPatternToTempDirLocationPatternArrayNullException extends RuntimeException {
        private CopyLocationPatternToTempDirLocationPatternArrayNullException() {
            super("location pattern array must not be null");
        }
    }

    /**
     * See {@link SpringResourceUtils#copyLocationPatternArrayToTempDir(java.lang.String...)}
     *
     * @see SpringResourceUtils#copyLocationPatternArrayToTempDir(java.lang.String...)
     */
    public static final class CopyLocationPatternToTempDirLocationPatternArrayEmptyException extends RuntimeException {
        private CopyLocationPatternToTempDirLocationPatternArrayEmptyException() {
            super("location pattern array must not be empty");
        }
    }

    /**
     * See {@link #copyResourceToDir(Path, Resource)}
     *
     * @see #copyResourceToDir(Path, Resource)
     */
    public static final class CopyResourceToDirIOUtilsCopyException extends RuntimeException {
        private CopyResourceToDirIOUtilsCopyException(final Throwable cause) {
            super("could not copy resource to target file", cause);
        }
    }

    /**
     * See {@link #getSpringResources(String)}
     *
     * @see #getSpringResources(String)
     */
    public static final class GetSpringResourcesByLocationPatternException extends RuntimeException {
        GetSpringResourcesByLocationPatternException(final String message, final Throwable cause) {
            super(message, cause);
        }
    }

    public static final class CopyResourceToDirNullTargetException extends RuntimeException {
        private CopyResourceToDirNullTargetException() {
            super("target directory must not be null");
        }
    }

    public static final class CopyResourceToDirTargetDoesNotExistException extends RuntimeException {
        private CopyResourceToDirTargetDoesNotExistException() {
            super("target directory does not exist");
        }
    }

    public static final class CopyResourceToDirNullResourceException extends RuntimeException {
        private CopyResourceToDirNullResourceException() {
            super("resource must not be null");
        }
    }

    public static final class CopyResourceToDirResourceDoesNotExistException extends RuntimeException {
        private CopyResourceToDirResourceDoesNotExistException() {
            super("resource does not exist");
        }
    }

    public static final class CopyResourceToDirResourceNullFilenameException extends RuntimeException {
        private CopyResourceToDirResourceNullFilenameException() {
            super("resource filename must not be null");
        }
    }
}
