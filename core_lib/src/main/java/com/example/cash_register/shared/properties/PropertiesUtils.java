package com.example.cash_register.shared.properties;

import java.io.InputStream;
import java.util.Properties;

/**
 * Utilities for parsing and getting {@link Properties} objects.
 */
public class PropertiesUtils {
    /**
     * Parses the provided properties resource, then places the appropriate overrides from the JVM System Properties and
     * returns the properties object.
     *
     * @param propertiesResourceName The properties resource to parse.
     *
     * @return The properties object, which consists of the properties set in the provided resource, overwritten by any
     * properties already in the JVM System Properties.
     */
    public Properties getProperties(final String propertiesResourceName) {
        final Properties properties = this.parsePropertiesFile(propertiesResourceName);
        for (Object key : properties.keySet()) {
            if (System.getProperties().containsKey(key)) {
                properties.put(key, System.getProperties().get(key));
            }
        }
        return properties;
    }

    /**
     * Remove any JVM System Properties overrides for the properties available in the provided properties resource
     * file.
     */
    public void removeSystemPropertiesOverrides(final String propertiesResourceName) {
        final Properties properties = this.parsePropertiesFile(propertiesResourceName);
        for (Object key : properties.keySet()) {
            System.getProperties().remove(key);
        }
    }


    /**
     * Parses the provide property resource and returns the {@link Properties} object that results.
     *
     * @param propertiesResourceName The properties resource to parse.
     *
     * @return The properties parsed from the resource.
     */
    private Properties parsePropertiesFile(String propertiesResourceName) {
        Properties properties = new Properties();
        InputStream inputStream =
                this.getClass().getResourceAsStream(propertiesResourceName);
        this.propertiesLoadWrapper(properties, inputStream);
        return properties;
    }

    /**
     * Wrapper for the {@link Properties#load(InputStream)} method.
     *
     * @param thisProperties The properties object to load.
     * @param inputStream Per {@link Properties#load(InputStream)}
     *
     * @throws PropertiesLoadException If {@link Properties#load(InputStream)} exceptions, that exception will be the
     * cause.
     */
    void propertiesLoadWrapper(final Properties thisProperties, final InputStream inputStream) {
        try {
            thisProperties.load(inputStream);
        }
        catch (final Throwable throwable) {
            throw new PropertiesLoadException(throwable);
        }
    }

    /**
     * See {@link #propertiesLoadWrapper(Properties, InputStream)}
     *
     * @see #propertiesLoadWrapper(Properties, InputStream)
     */
    public static final class PropertiesLoadException extends RuntimeException {
        PropertiesLoadException(Throwable cause) {
            super("error during properties load", cause);
        }
    }
}
