package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.List;

import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CalculateChangeWorkflowRunnerTests {
    private static final CalculateChangeArgs INPUT_ARGS;

    static {
        INPUT_ARGS = CalculateChangeArgs.builder()
                .owed(USD_PENNY_VALUE)
                .tendered(USD_NICKEL_VALUE)
                .build();
    }

    @Autowired
    private CalculateChangeWorkflowRunner workflowRunner;
    @Autowired
    private InputTranslatorPassThroughSingle inputTranslatorPassThroughSingle;
    @Autowired
    private InputParserPassThroughSingle inputParserPassThroughSingle;
    @Autowired
    private ChangeCalculatorFewest changeCalculatorFewest;

    @Test
    public void runWorkflow_test() {
        List<CalculateChangeResult> resultList =
                this.workflowRunner.runWorkflow(
                        INPUT_ARGS,
                        this.inputTranslatorPassThroughSingle,
                        this.inputParserPassThroughSingle,
                        this.changeCalculatorFewest);
        MatcherAssert.assertThat(resultList, notNullValue());
        MatcherAssert.assertThat(resultList, hasSize(1));
        MatcherAssert.assertThat(resultList.get(0).isSuccessful(), equalTo(true));
    }

    @Test
    public void runWorkflowSingle_test() {
        CalculateChangeResult result =
                this.workflowRunner.runWorkflowSingle(
                        this.changeCalculatorFewest,
                        INPUT_ARGS);
        MatcherAssert.assertThat(result, notNullValue());
        MatcherAssert.assertThat(result.isSuccessful(), equalTo(true));
    }

    @Test(expected = CalculateChangeWorkflowRunner.TranslationInputNullException.class)
    public void runWorkflow_TranslationInputNullException_test() {
        this.workflowRunner.runWorkflow(
                INPUT_ARGS,
                null,
                this.inputParserPassThroughSingle,
                changeCalculatorFewest);
    }

    @Test(expected = CalculateChangeWorkflowRunner.ParserInputNullException.class)
    public void runWorkflow_ParserInputNullException_test() {
        this.workflowRunner.runWorkflow(
                INPUT_ARGS,
                null,
                changeCalculatorFewest);
    }

    @Test(expected = CalculateChangeWorkflowRunner.InputArgsListNullException.class)
    public void runWorkflow_InputArgsListNullException_test() {
        this.workflowRunner.runWorkflow(
                changeCalculatorFewest,
                (List<CalculateChangeArgs>) null);
    }

    @Test(expected = CalculateChangeWorkflowRunner.InputArgsListEmptyException.class)
    public void runWorkflow_InputArgsListEmptyException_test() {
        this.workflowRunner.runWorkflow(
                changeCalculatorFewest,
                Collections.emptyList());
    }

    @Test(expected = CalculateChangeWorkflowRunner.ChangeCalculatorNullException.class)
    public void runWorkflow_ChangeCalculatorNullException_test() {
        CalculateChangeArgs args = CalculateChangeArgs.createIntentionallyInvalidArgs();
        this.workflowRunner.runWorkflow(
                null,
                Collections.singletonList(args));
    }

    @Test(expected = CalculateChangeWorkflowRunner.InputArgsArrayNullException.class)
    public void runWorkflow_InputArgsArrayNullException_test() {
        this.workflowRunner.runWorkflow(
                changeCalculatorFewest,
                (CalculateChangeArgs[]) null);
    }

    @Test(expected = CalculateChangeWorkflowRunner.InputArgsNullException.class)
    public void runWorkflowSingle_InputArgsNullException_test() {
        this.workflowRunner.runWorkflowSingle(
                this.changeCalculatorFewest,
                null);
    }
}
