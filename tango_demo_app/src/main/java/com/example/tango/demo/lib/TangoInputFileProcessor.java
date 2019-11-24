package com.example.tango.demo.lib;

import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.CalculateChangeWorkflowRunner;
import com.example.cash_register.currency.InputStreamTranslatorPath;
import com.example.tango.lib.TangoChangeCalculator;
import com.example.tango.lib.TangoInputParser;
import com.example.tango.lib.TangoResultsWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.swing.JFrame;
import java.nio.file.Path;
import java.util.List;

/**
 * Implementation of {@link InputFileProcessorBase} which processes a tango input file and displays the results.
 */
@Component(TangoInputFileProcessor.QUALIFIER)
class TangoInputFileProcessor extends InputFileProcessorBase {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.tango.demo.lib.TangoInputFileProcessor";

    /**
     * See {@link TangoInputParser}.
     */
    private final TangoInputParser inputParser;

    /**
     * See {@link InputStreamTranslatorPath}.
     */
    private final InputStreamTranslatorPath inputTranslator;

    /**
     * See {@link TangoChangeCalculator}.
     */
    private final TangoChangeCalculator changeCalculator;

    /**
     * See {@link CalculateChangeWorkflowRunner}.
     */
    private final CalculateChangeWorkflowRunner workflowRunner;

    /**
     * See {@link TangoOutputFrameCreator}.
     */
    private final TangoOutputFrameCreator outputFrameCreator;

    /**
     * Autowired constructor.
     *
     * @param inputParser See {@link TangoInputParser}.
     * @param inputTranslator See {@link InputStreamTranslatorPath}.
     * @param changeCalculator See {@link TangoChangeCalculator}.
     * @param workflowRunner See {@link CalculateChangeWorkflowRunner}.
     * @param outputFrameCreator See {@link TangoOutputFrameCreator}.
     */
    @Autowired
    private TangoInputFileProcessor(
            final TangoInputParser inputParser,
            final InputStreamTranslatorPath inputTranslator,
            final TangoChangeCalculator changeCalculator,
            final CalculateChangeWorkflowRunner workflowRunner,
            final TangoOutputFrameCreator outputFrameCreator) {
        this.inputParser = inputParser;
        this.inputTranslator = inputTranslator;
        this.changeCalculator = changeCalculator;
        this.workflowRunner = workflowRunner;
        this.outputFrameCreator = outputFrameCreator;
    }

    /**
     * Implementation to process an input file, write the results, and then display the results.
     *
     * @param inputFile The file to process.
     */
    @Override
    void processInputFile(final Path inputFile) {
        final List<CalculateChangeResult> resultList = this.workflowRunner.runWorkflow(
                inputFile,
                this.inputTranslator,
                this.inputParser,
                this.changeCalculator);

        final Path changeOutputAndErrorSummaryFile =
                this.getTempDirComponent().getTempDir().resolve(TangoResultsWriter.DEFAULT_CHANGE_OUTPUT_AND_ERROR_SUMMARY_FILENAME);
        final Path errorDetailsFile =
                this.getTempDirComponent().getTempDir().resolve(TangoResultsWriter.DEFAULT_ERROR_DETAILS_FILENAME);
        final TangoResultsWriter writer = TangoResultsWriter.create(changeOutputAndErrorSummaryFile, errorDetailsFile);
        try (writer) {
            writer.write(resultList);
        }

        final CreateOutputFrameArgs args = CreateOutputFrameArgs.builder()
                .inputFile(inputFile)
                .outputFile(changeOutputAndErrorSummaryFile)
                .errorFile(errorDetailsFile)
                .build();
        final JFrame frame = this.outputFrameCreator.createFrame(args);
        frame.setVisible(true);
    }
}
