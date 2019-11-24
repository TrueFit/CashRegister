package com.example.cash_register.currency;

import com.example.cash_register.shared.mappers.ObjectMapperConfig;
import com.example.cash_register.shared.resources.ResourceStringValidator;
import com.example.cash_register.shared.resources.SpringResourceUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.text.TextStringBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@SuppressWarnings("UnnecessaryLocalVariable")
@Component(PhysicalSetConfigParser.QUALIFIER)
class PhysicalSetConfigParser {
    static final String QUALIFIER = "com.example.cash_register.currency.PhysicalSetConfigParser";

    /**
     * See {@link ObjectMapperConfig#jsonObjectMapper()}
     */
    private final ObjectMapper jsonObjectMapper;
    /**
     * See {@link SpringResourceUtils}.
     */
    private final SpringResourceUtils springResourceUtils;
    /**
     * See {@link PhysicalSetConfigParserResultCollection.Validator}
     */
    private final PhysicalSetConfigParserResultCollection.Validator physicalSetConfigParserResultsCollectionValidator;
    /**
     * See {@link ResourceStringValidator}.
     */
    private final ResourceStringValidator resourceStringValidator;

    /**
     * Autowired constructor.
     *
     * @param jsonObjectMapper See {@link ObjectMapperConfig#jsonObjectMapper()}.
     * @param physicalSetConfigParserResultsCollectionValidator See {@link PhysicalSetConfigParserResultCollection.Validator}.
     * @param springResourceUtils See {@link SpringResourceUtils}.
     * @param resourceStringValidator See {@link ResourceStringValidator}.
     */
    @Autowired
    PhysicalSetConfigParser(
            @Qualifier(ObjectMapperConfig.JSON_OBJECT_MAPPER_QUALIFIER) final ObjectMapper jsonObjectMapper,
            final PhysicalSetConfigParserResultCollection.Validator physicalSetConfigParserResultsCollectionValidator,
            final SpringResourceUtils springResourceUtils,
            final ResourceStringValidator resourceStringValidator) {
        this.jsonObjectMapper = jsonObjectMapper;
        this.springResourceUtils = springResourceUtils;
        this.physicalSetConfigParserResultsCollectionValidator = physicalSetConfigParserResultsCollectionValidator;
        this.resourceStringValidator = resourceStringValidator;
    }

    PhysicalSetConfigParserResultCollection parseResources(final String locationPattern) {
        this.resourceStringValidator.checkResourceString(locationPattern);
        final Resource[] resources = this.springResourceUtils.getSpringResources(locationPattern);
        return this.parseResources(resources);
    }

    private PhysicalSetConfigParserResultCollection parseResources(final Resource[] resources) {
        final List<PhysicalSetConfigParserResult> placeholder = Arrays.stream(resources)
                .parallel()
                .map(this::resultsFromResource)
                .collect(Collectors.toUnmodifiableList());

        final PhysicalSetConfigParserResultCollection parserResultsCollection = new PhysicalSetConfigParserResultCollection(placeholder);
        this.physicalSetConfigParserResultsCollectionValidator.validate(parserResultsCollection);
        return parserResultsCollection;
    }

    private PhysicalSetConfigParserResult resultsFromResource(final Resource resource) {
        InputStream resourceStream;
        try {
            resourceStream = resource.getInputStream();
        }
        catch (final Throwable throwable) {
            final String message = new TextStringBuilder()
                    .append("Resource: ").appendln(resource)
                    .appendln("Could not create input stream from the resource")
                    .build();
            final Throwable fromResourceGetInputStreamException = new FromResourceGetInputStreamException(message, throwable);
            return PhysicalSetConfigParserResult.fromJsonParseException(fromResourceGetInputStreamException);
        }

        PhysicalSetConfig physicalSetConfig;
        try {
            physicalSetConfig = this.jsonObjectMapper.readValue(resourceStream, PhysicalSetConfig.class);
        }
        catch (final Throwable throwable) {
            final String message = new TextStringBuilder()
                    .append("Resource: ").appendln(resource)
                    .appendln("Updating via `ObjectMapper.readValue` failed")
                    .build();
            final Throwable fromResourceReadValueException = new FromResourceReadValueException(message, throwable);
            return PhysicalSetConfigParserResult.fromJsonParseException(fromResourceReadValueException);
        }

        final PhysicalSetConfigParserResult result =
                PhysicalSetConfigParserResult.fromPhysicalSetConfig(physicalSetConfig);
        return result;
    }

    static abstract class ValidationException extends CashRegisterException {
        private ValidationException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    static abstract class PrimaryValidationException extends ValidationException {
        private PrimaryValidationException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    static abstract class FromResourceException extends PrimaryValidationException {
        private FromResourceException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    static final class FromResourceReadValueException extends FromResourceException {
        private FromResourceReadValueException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    static final class FromResourceGetInputStreamException extends FromResourceException {
        private FromResourceGetInputStreamException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
