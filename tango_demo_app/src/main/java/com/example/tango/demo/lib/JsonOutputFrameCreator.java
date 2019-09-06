package com.example.tango.demo.lib;

import org.springframework.stereotype.Component;

import javax.swing.JFrame;

/**
 * Implementation of {@link OutputFrameCreatorBase} to create output frame for JSON input file results.
 */
@Component(JsonOutputFrameCreator.QUALIFIER)
class JsonOutputFrameCreator extends OutputFrameCreatorBase {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.tango.demo.lib.JsonOutputFrameCreator";

    /**
     * Implementation of {@link OutputFrameCreatorBase#createFrame(CreateOutputFrameArgs)}; for JSON output this will be
     * the configuration information pane, the input pane, and the output pane.
     *
     * @param args Create frame args.
     *
     * @return The created frame.
     *
     * @throws CreateFrameException if any of the pane or frame creation exceptions, that exception will be the cause.
     */
    @Override
    JFrame createFrame(CreateOutputFrameArgs args) {
        try {
            java.awt.Component configurationPane = this.createConfigurationInformationPane();
            java.awt.Component inputPane = this.createInputPane(args);
            java.awt.Component outputPane = this.createOutputFrame(" OUTPUT: ", args);
            return this.createOutputFrame(3, configurationPane, inputPane, outputPane);
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
