package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static com.example.cash_register.CurrencyValueConstantsForTests.USD_DOLLAR_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class ChangeCalculatorMostTests {
    @Autowired
    private CalculateChangeArgs.InputModelParser inputModelParser;

    @Autowired
    private ChangeCalculatorMost changeCalculator;

    @Autowired
    private InputStreamTranslatorResourceName inputTranslator;

    @Autowired
    private CalculateChangeWorkflowRunner workflowRunner;

    @Test
    public void calculateChange_viaCalculateChangeWorkflowRunner_test() {
        String resourceName = "/com/example/cash_register/currency/sample_input/sample_USD_1.json";
        List<CalculateChangeResult> resultList = this.workflowRunner.runWorkflow(
                resourceName,
                this.inputTranslator,
                this.inputModelParser,
                this.changeCalculator);
    }

    @Test
    public void calculateChange_viaCalculateChangeArgsObject_test() {
        final CalculateChangeArgs input = CalculateChangeArgs.builder()
                .tendered(USD_DOLLAR_VALUE)
                .owed(USD_PENNY_VALUE)
                .build();

        final CalculateChangeResult result = this.changeCalculator.calculate(input);
        MatcherAssert.assertThat(result.getOutputChangeBag(), hasSize(99));
        MatcherAssert.assertThat(result.isSuccessful(), equalTo(true));
        MatcherAssert.assertThat(result.isNotSuccessful(), equalTo(false));
    }

    @Test
    public void calculateChange_tenderedLessThanOwed_test() {
        final CalculateChangeArgs input = CalculateChangeArgs.builder()
                .tendered(USD_PENNY_VALUE)
                .owed(USD_NICKEL_VALUE)
                .build();
        final CalculateChangeResult result = this.changeCalculator.calculate(input);
        MatcherAssert.assertThat(result.isSuccessful(), equalTo(false));
        MatcherAssert.assertThat(result.isNotSuccessful(), equalTo(true));
    }
}
