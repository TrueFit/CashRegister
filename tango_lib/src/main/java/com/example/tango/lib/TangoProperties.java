package com.example.tango.lib;

import com.example.cash_register.currency.UnitValue;
import com.example.cash_register.shared.properties.PropertiesUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.util.Properties;

/**
 * A helper class which wraps processing for the {@code `tango.properties`} properties file.  This file contains several
 * configurable properties which may also be overridden via JVM System properties of the same name.
 */
@Component(TangoProperties.QUALIFIER)
public class TangoProperties {
    /**
     * The resource name for the {@code `tango.properties`} file.
     */
    public final static String PROPERTIES_RESOURCE_NAME = "/tango.properties";
    /**
     * The property name for the configured random change divisor.
     *
     * @see #getRandomChangeDivisor()
     */
    public final static String RANDOM_CHANGE_DIVISOR_PROPERTY_NAME =
            "com.example.tango.lib.TangoChangeCalculator.randomChangeDivisor";

    /**
     * Spring qualifier.
     */
    final static String QUALIFIER = "com.example.tango.lib.TangoProperties";

    /**
     * See {@link TangoPropertiesFile}
     */
    private final TangoPropertiesFile tangoPropertiesFile;

    /**
     * Autowired constructor.
     *
     * @param tangoPropertiesFile See {@link TangoPropertiesFile}.
     */
    @Autowired
    TangoProperties(
            final TangoPropertiesFile tangoPropertiesFile) {
        this.tangoPropertiesFile = tangoPropertiesFile;
    }

    /**
     * Remove any JVM System Properties overrides for the properties available in the {@code `tango.properties`}
     * file.
     */
    public final void removeSystemPropertiesOverrides() {
        this.tangoPropertiesFile.removeSystemPropertiesOverrides();
    }

    /**
     * The configured random change divisor for this project.
     *
     * @return The configured random change divisor for this project.
     *
     * @throws RandomChangeDivisorNonPositiveException When the random change divisor is non-positive.
     */
    public BigInteger getRandomChangeDivisor() {
        final BigInteger bigInteger = new BigInteger(this.tangoPropertiesFile.getRandomChangeDivisorValue());
        if (bigInteger.compareTo(UnitValue.ZERO) <= 0) {
            throw new RandomChangeDivisorNonPositiveException();
        }
        return bigInteger;
    }

    /**
     * Sets the configured random change divisor for this application.
     *
     * @param randomChangeDivisor The random change divisor.
     *
     * @return The results of {@link #getRandomChangeDivisor()}, after the provided random change divisor has been
     * configured.
     *
     * @see #getRandomChangeDivisor()
     */
    public BigInteger setRandomChangeDivisor(final BigInteger randomChangeDivisor) {
        final String originalRandomChangeDivisor = this.tangoPropertiesFile.getRandomChangeDivisorValue();
        System.setProperty(RANDOM_CHANGE_DIVISOR_PROPERTY_NAME, randomChangeDivisor.toString());
        try {
            return this.getRandomChangeDivisor();
        }
        catch (final Throwable throwable) {
            this.tangoPropertiesFile.setRandomChangeDivisorValue(originalRandomChangeDivisor);
            throw throwable;
        }
    }

    /**
     * Sets the configured random change divisor for this application.
     *
     * @param randomChangeDivisor The random change divisor.
     *
     * @return The results of {@link #getRandomChangeDivisor()}, after the provided random change divisor has been
     * configured.
     *
     * @see #getRandomChangeDivisor()
     * @see #setRandomChangeDivisor(BigInteger)
     */
    public BigInteger setRandomChangeDivisor(final long randomChangeDivisor) {
        final BigInteger bigInteger = BigInteger.valueOf(randomChangeDivisor);
        return this.setRandomChangeDivisor(bigInteger);
    }

    /**
     * A helper class which handles getting, setting, and overriding the {@code String} properties available in the
     * {@code `tango.properties`} file, and the associated JVM system properties.
     */
    @Component(TangoPropertiesFile.QUALIFIER)
    static class TangoPropertiesFile {
        /**
         * Spring qualifier.
         */
        static final String QUALIFIER = "com.example.tango.lib.TangoProperties.TangoPropertiesFile";
        /**
         * See {@link PropertiesUtils}.
         */
        private final PropertiesUtils propertiesUtils;

        /**
         * Autowired constructor.
         *
         * @param propertiesUtils See {@link PropertiesUtils}.
         */
        @Autowired
        private TangoPropertiesFile(final PropertiesUtils propertiesUtils) {
            this.propertiesUtils = propertiesUtils;
        }

        /**
         * Remove any JVM System Properties overrides for the properties available in the {@code `tango.properties`}
         * file.
         */
        private void removeSystemPropertiesOverrides() {
            this.propertiesUtils.removeSystemPropertiesOverrides(PROPERTIES_RESOURCE_NAME);
        }

        /**
         * Creates and returns {@link Properties} from {@code `tango.properties`}.
         *
         * @return The {@link Properties} object.
         *
         * @see PropertiesUtils#getProperties(String)
         */
        private Properties getProperties() {
            return this.propertiesUtils.getProperties(PROPERTIES_RESOURCE_NAME);
        }

        /**
         * Gets the configured random change divisor for this application.
         *
         * @return The configured random change divisor for this application.
         */
        private String getRandomChangeDivisorValue() {
            return this.getProperties().getProperty(RANDOM_CHANGE_DIVISOR_PROPERTY_NAME);
        }

        /**
         * Sets the configured random change divisor for this application.
         *
         * @param randomChangeDivisor The configured random change divisor for this application.
         */
        private void setRandomChangeDivisorValue(final String randomChangeDivisor) {
            System.setProperty(RANDOM_CHANGE_DIVISOR_PROPERTY_NAME, randomChangeDivisor);
        }
    }

    /**
     * See {@link #getRandomChangeDivisor()}
     *
     * @see #getRandomChangeDivisor()
     */
    static final class RandomChangeDivisorNonPositiveException extends RuntimeException {
        RandomChangeDivisorNonPositiveException() {
            super("random change divisor must be positive");
        }
    }
}
