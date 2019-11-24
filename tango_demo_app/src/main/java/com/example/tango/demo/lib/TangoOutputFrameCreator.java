package com.example.tango.demo.lib;

import org.springframework.stereotype.Component;

import javax.swing.JFrame;

/**
 * Implementation of {@link OutputFrameCreatorBase} to create output frame for tango input file results.
 */
@Component(TangoOutputFrameCreator.QUALIFIER)
class TangoOutputFrameCreator extends OutputFrameCreatorBase {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.tango.demo.lib.TangoOutputFrameCreator";

    /**
     * Implementation of {@link OutputFrameCreatorBase#createFrame(CreateOutputFrameArgs)}; for tango output, this will
     * be the configuration information pane, the input pane, the output pane, and the error pane.
     *
     * @param args Create frame args.
     *
     * @return The created frame.
     *
     * @throws CreateFrameException If any of the pane or frame creation exceptions, that exception will be the cause.
     */
    @Override
    JFrame createFrame(final CreateOutputFrameArgs args) {
        try {
            final java.awt.Component configurationPane = this.createConfigurationInformationPane();
            final java.awt.Component inputPane = this.createInputPane(args);
            final java.awt.Component outputPane = this.createOutputFrame(" CHANGE OUTPUT AND ERROR SUMMARIES: ", args);
            final java.awt.Component errorPane = this.createErrorPane(args);
            return this.createOutputFrame(4, configurationPane, inputPane, outputPane, errorPane);
        }
        catch (final Throwable throwable) {
            throw new CreateFrameException(throwable);
        }
    }

    /**
     * See {@link #createFrame(CreateOutputFrameArgs)}
     *
     * @see #createFrame(CreateOutputFrameArgs)
     */
    static final class CreateFrameException extends RuntimeException {
        CreateFrameException(Throwable throwable) {
            super(throwable);
        }
    }
}
