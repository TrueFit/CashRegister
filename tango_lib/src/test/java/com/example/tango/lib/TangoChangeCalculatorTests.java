package com.example.tango.lib;

import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.CalculateChangeWorkflowRunner;
import com.example.cash_register.currency.CurrencyModelMapper;
import com.example.cash_register.currency.CurrencySumUtils;
import com.example.cash_register.currency.CurrencyValue;
import com.example.cash_register.currency.InputStreamTranslatorResourceName;
import com.example.cash_register.currency.PhysicalCurrency;
import com.example.cash_register.currency.UnitValue;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.SortedBag;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.collection.IsEmptyCollection.empty;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNot.not;

@SuppressWarnings("UnnecessaryLocalVariable")
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = TestConfig.class)
public class TangoChangeCalculatorTests {
    @Autowired
    private TangoInputParser inputParser;

    @Autowired
    private InputStreamTranslatorResourceName inputTranslator;

    @Autowired
    private TangoChangeCalculator changeCalculator;

    @Autowired
    private CalculateChangeWorkflowRunner calculateChangeWorkflowRunner;

    @Autowired
    private CurrencyModelMapper currencyModelMapper;

    @Test
    public void runWorkflow_test() {
        final String resourceName = "/com/example/tango/input/mixed_input.txt";
        final List<CalculateChangeResult> resultList = this.runWorkflow(resourceName);
        MatcherAssert.assertThat(resultList, not(empty()));
    }

    /**
     * Test that the tango change calculate uses the random physical currency converter when the owed value is divisible
     * by the random change divisor (configured to {@code 3} for these tests.
     */
    @Test
    public void runWorkflow_usingRandomConverter_test() {
        final String resourceName = "/com/example/tango/input/will_use_random_converter.txt";
        List<CalculateChangeResult> resultList = this.runWorkflow(resourceName);
        MatcherAssert.assertThat(resultList, hasSize(1));
        MatcherAssert.assertThat(resultList.get(0).isSuccessful(), equalTo(true));

        SortedBag<PhysicalCurrency> changeBag = resultList.get(0).getOutputChangeBag();
        boolean foundDifferentBag = false;
        while (! foundDifferentBag) {
            resultList = this.runWorkflow(resourceName);
            SortedBag<PhysicalCurrency> placeholder = resultList.get(0).getOutputChangeBag();
            foundDifferentBag = ! CollectionUtils.isEqualCollection(placeholder, changeBag);
        }

        for (int i = 0; i < 1_000; i++) {
            resultList = this.runWorkflow(resourceName);
            changeBag = resultList.get(0).getOutputChangeBag();
            CurrencyValue sum = CurrencySumUtils.sumPhysicalCurrency(changeBag);

            MatcherAssert.assertThat(sum.getUnitValue(), equalTo(UnitValue.valueOf(1993)));
        }
    }

    /**
     * Test that the tango change calculate uses the fewest physical currency converter when the owed value is not
     * divisible by the random change divisor (configured to {@code 3} for these tests.
     */
    @Test
    public void runWorkflow_usingFewestConverter_test() {
        final String resourceName = "/com/example/tango/input/will_use_fewest_converter.txt";
        List<CalculateChangeResult> resultList = this.runWorkflow(resourceName);
        MatcherAssert.assertThat(resultList, hasSize(1));
        MatcherAssert.assertThat(resultList.get(0).isSuccessful(), equalTo(true));

        for (int i = 0; i < 1_000; i++) {
            resultList = this.runWorkflow(resourceName);
            final SortedBag<PhysicalCurrency> changeBag = resultList.get(0).getOutputChangeBag();
            CurrencyValue sum = CurrencySumUtils.sumPhysicalCurrency(changeBag);
            MatcherAssert.assertThat(changeBag, hasSize(15));
            MatcherAssert.assertThat(sum.getUnitValue(), equalTo(UnitValue.valueOf(1999)));
        }
    }

    private List<CalculateChangeResult> runWorkflow(String resourceName) {
        final List<CalculateChangeResult> resultList =
                this.calculateChangeWorkflowRunner.runWorkflow(
                        resourceName,
                        this.inputTranslator,
                        this.inputParser,
                        this.changeCalculator);
        return resultList;
    }
}
