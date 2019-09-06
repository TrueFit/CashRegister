package com.example.tango.demo.lib;

import com.example.cash_register.currency.CalculateChangeArgs;
import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.CalculateChangeResultsWriter;
import com.example.cash_register.currency.CalculateChangeWorkflowRunner;
import com.example.cash_register.currency.ChangeCalculatorFewest;
import com.example.cash_register.currency.InputStreamTranslatorPath;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.swing.JFrame;
import java.nio.file.Path;
import java.util.List;

/**
 * Implementation of {@link InputFileProcessorBase} which processes a JSON input file and displays the results.
 */
@Component(JsonInputFileProcessor.QUALIFIER)
class JsonInputFileProcessor extends InputFileProcessorBase {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.tango.demo.lib.JsonInputFileProcessor";

    /**
     * Input parser.
     *
     * @see CalculateChangeArgs.InputModelParser
     */
    @Autowired
    private CalculateChangeArgs.InputModelParser inputParser;

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
     * @see ChangeCalculatorFewest
     */
    @Autowired
    private ChangeCalculatorFewest changeCalculator;

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
     * @see JsonOutputFrameCreator
     */
    @Autowired
    private JsonOutputFrameCreator outputFrameCreator;

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

        Path outputFile = this.getTempDirComponent().getTempDir().resolve(CalculateChangeResultsWriter.DEFAULT_OUTPUT_FILENAME);
        CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.create(outputFile);
        try (writer) {
            writer.write(resultList);
        }

        CreateOutputFrameArgs args = CreateOutputFrameArgs.builder()
                .inputFile(inputFile)
                .outputFile(outputFile)
                .build();
        JFrame frame = this.outputFrameCreator.createFrame(args);
        frame.setVisible(true);
    }
}
