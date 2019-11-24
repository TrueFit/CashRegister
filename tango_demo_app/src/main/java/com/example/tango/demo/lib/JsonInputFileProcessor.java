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
     * See {@link CalculateChangeArgs.InputModelParser}.
     */
    private final CalculateChangeArgs.InputModelParser inputParser;

    /**
     * See {@link InputStreamTranslatorPath}.
     */
    private final InputStreamTranslatorPath inputTranslator;

    /**
     * See {@link ChangeCalculatorFewest}.
     */
    private final ChangeCalculatorFewest changeCalculator;

    /**
     * See {@link CalculateChangeWorkflowRunner}.
     */
    private final CalculateChangeWorkflowRunner workflowRunner;

    /**
     * See {@link JsonOutputFrameCreator}.
     */
    private final JsonOutputFrameCreator outputFrameCreator;

    /**
     * Autowired constructor.
     *
     * @param inputParser See {@link CalculateChangeArgs.InputModelParser}.
     * @param inputTranslator See {@link InputStreamTranslatorPath}.
     * @param changeCalculator See {@link ChangeCalculatorFewest}.
     * @param workflowRunner See {@link CalculateChangeWorkflowRunner}.
     * @param outputFrameCreator See {@link JsonOutputFrameCreator}.
     */
    @Autowired
    private JsonInputFileProcessor(
            final CalculateChangeArgs.InputModelParser inputParser,
            final InputStreamTranslatorPath inputTranslator,
            final ChangeCalculatorFewest changeCalculator,
            final CalculateChangeWorkflowRunner workflowRunner,
            final JsonOutputFrameCreator outputFrameCreator) {
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

        final Path outputFile = this.getTempDirComponent().getTempDir().resolve(CalculateChangeResultsWriter.DEFAULT_OUTPUT_FILENAME);
        final CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.create(outputFile);
        try (writer) {
            writer.write(resultList);
        }

        final CreateOutputFrameArgs args = CreateOutputFrameArgs.builder()
                .inputFile(inputFile)
                .outputFile(outputFile)
                .build();
        final JFrame frame = this.outputFrameCreator.createFrame(args);
        frame.setVisible(true);
    }
}
