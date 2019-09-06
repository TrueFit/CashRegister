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
     * Input parser.
     *
     * @see TangoInputParser
     */
    @Autowired
    private TangoInputParser inputParser;

    /**
     * Input translator.
     *
     * @see InputStreamTranslatorPath
     */
    @Autowired
    private InputStreamTranslatorPath inputTranslator;

    /**
     * Change calculator
     *
     * @see TangoChangeCalculator
     */
    @Autowired
    private TangoChangeCalculator changeCalculator;

    /**
     * The workflow runner.
     *
     * @see CalculateChangeWorkflowRunner
     */
    @Autowired
    private CalculateChangeWorkflowRunner workflowRunner;

    /**
     * The output frame creator.
     *
     * @see TangoOutputFrameCreator
     */
    @Autowired
    private TangoOutputFrameCreator outputFrameCreator;

    /**
     * Implementation to process an input file, write the results, and then display the results.
     *
     * @param inputFile The file to process.
     */
    @Override
    void processInputFile(Path inputFile) {
        List<CalculateChangeResult> resultList = this.workflowRunner.runWorkflow(
                inputFile,
                this.inputTranslator,
                this.inputParser,
                this.changeCalculator);

        Path changeOutputAndErrorSummaryFile =
                this.getTempDirComponent().getTempDir().resolve(TangoResultsWriter.DEFAULT_CHANGE_OUTPUT_AND_ERROR_SUMMARY_FILENAME);
        Path errorDetailsFile =
                this.getTempDirComponent().getTempDir().resolve(TangoResultsWriter.DEFAULT_ERROR_DETAILS_FILENAME);
        TangoResultsWriter writer = TangoResultsWriter.create(changeOutputAndErrorSummaryFile, errorDetailsFile);
        try (writer) {
            writer.write(resultList);
        }

        CreateOutputFrameArgs args = CreateOutputFrameArgs.builder()
                .inputFile(inputFile)
                .outputFile(changeOutputAndErrorSummaryFile)
                .errorFile(errorDetailsFile)
                .build();
        JFrame frame = this.outputFrameCreator.createFrame(args);
        frame.setVisible(true);
    }
}
