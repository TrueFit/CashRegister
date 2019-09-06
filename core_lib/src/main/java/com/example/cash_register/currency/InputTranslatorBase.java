package com.example.cash_register.currency;

/**
 * The base class for input translator objects; part of the calculate change workflow objects. These objects take an
 * arbitrary input object and translate it to a form appropriate for the {@link InputParserBase} object as the next step
 * of the calculate change workflow.
 *
 * @param <TInput> The type of input object.
 * @param <TTranslation> The type that is translated and provided to an {@link InputParserBase} object as the next step
 * in the calculate change workflow.
 *
 * @see InputStreamTranslatorFile
 * @see InputStreamTranslatorFilename
 * @see InputTranslatorPassThroughSingle
 * @see InputStreamTranslatorPath
 * @see InputStreamTranslatorResourceName
 * @see InputParserBase
 * @see CalculateChangeWorkflowRunner
 */
public abstract class InputTranslatorBase<TInput, TTranslation> {
    protected InputTranslatorBase() {
        super();
    }

    /**
     * Takes an arbitrary input and translates it to another input.
     *
     * @param item The input to translate.
     *
     * @return The translation.
     */
    final TTranslation translate(TInput item) {
        return this.translateImpl(item);
    }

    /**
     * Subclasses must implement this method and translate the input into an appropriate output for an {@link
     * InputParserBase} object.
     *
     * @param item The item to translate.
     *
     * @return The translation.
     */
    protected abstract TTranslation translateImpl(TInput item);
}
