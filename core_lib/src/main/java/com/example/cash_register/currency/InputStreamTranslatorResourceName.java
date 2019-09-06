package com.example.cash_register.currency;

import com.example.cash_register.shared.resources.ResourceStringValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 * Translates a string resource name to an input stream.
 */
@Component(InputStreamTranslatorResourceName.QUALIFIER)
public class InputStreamTranslatorResourceName extends InputStreamTranslatorBase<String> {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.currency.InputStreamTranslatorResourceName";
    /**
     * Resource string validator.
     *
     * @see ResourceStringValidator
     */
    private final ResourceStringValidator resourceStringValidator;

    /**
     * Autowired constructor.
     *
     * @param resourceStringValidator Resource string validator.
     */
    @Autowired
    private InputStreamTranslatorResourceName(ResourceStringValidator resourceStringValidator) {
        this.resourceStringValidator = resourceStringValidator;
    }

    /**
     * Translates a resource name to an input stream.
     *
     * @param resourceName The resource name.
     *
     * @return The input stream.
     *
     * @see ResourceStringValidator#checkResourceString(String)
     */
    @Override
    protected InputStream translateImpl(String resourceName) {
        this.resourceStringValidator.checkResourceString(resourceName);
        return this.getClass().getResourceAsStream(resourceName);
    }
}
