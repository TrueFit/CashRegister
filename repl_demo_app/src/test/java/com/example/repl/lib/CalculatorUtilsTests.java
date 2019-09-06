package com.example.repl.lib;

import com.example.cash_register.currency.CalculateChangeArgs;
import com.example.cash_register.currency.CalculateChangeResult;
import com.example.cash_register.currency.ChangeCalculatorBase;
import com.example.cash_register.currency.ChangeCalculatorFewest;
import com.example.cash_register.currency.ChangeCalculatorMost;
import com.example.cash_register.currency.ChangeCalculatorRandom;
import com.example.tango.lib.TangoChangeCalculator;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsInstanceOf.instanceOf;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CalculatorUtilsTests {
    @Autowired
    private CalculatorUtils calculatorUtils;

    @Test
    public void getChangeCalculator_test() {
        ChangeCalculatorBase fewest = this.calculatorUtils.getChangeCalculator(CalculatorUtils.CalculatorType.FEWEST);
        ChangeCalculatorBase most = this.calculatorUtils.getChangeCalculator(CalculatorUtils.CalculatorType.MOST);
        ChangeCalculatorBase random = this.calculatorUtils.getChangeCalculator(CalculatorUtils.CalculatorType.RANDOM);
        ChangeCalculatorBase tango = this.calculatorUtils.getChangeCalculator(CalculatorUtils.CalculatorType.TANGO);

        MatcherAssert.assertThat(fewest, instanceOf(ChangeCalculatorFewest.class));
        MatcherAssert.assertThat(most, instanceOf(ChangeCalculatorMost.class));
        MatcherAssert.assertThat(random, instanceOf(ChangeCalculatorRandom.class));
        MatcherAssert.assertThat(tango, instanceOf(TangoChangeCalculator.class));

        CalculatorUtils.CalculatorType enumFewest = this.calculatorUtils.getCalculatorType(fewest);
        CalculatorUtils.CalculatorType enumMost = this.calculatorUtils.getCalculatorType(most);
        CalculatorUtils.CalculatorType enumRandom = this.calculatorUtils.getCalculatorType(random);
        CalculatorUtils.CalculatorType enumTango = this.calculatorUtils.getCalculatorType(tango);

        MatcherAssert.assertThat(enumFewest, equalTo(CalculatorUtils.CalculatorType.FEWEST));
        MatcherAssert.assertThat(enumMost, equalTo(CalculatorUtils.CalculatorType.MOST));
        MatcherAssert.assertThat(enumRandom, equalTo(CalculatorUtils.CalculatorType.RANDOM));
        MatcherAssert.assertThat(enumTango, equalTo(CalculatorUtils.CalculatorType.TANGO));
    }

    @Test(expected = CalculatorUtils.CalculateTypeNotFoundException.class)
    public void getCalculatorType_CalculateTypeNotFoundException_test() {
        CalculatorUtils.CalculatorType enumBad = this.calculatorUtils.getCalculatorType(new MockChangeCalculator());
    }

    private static final class MockChangeCalculator extends ChangeCalculatorBase {
        @Override
        protected CalculateChangeResult calculateImpl(CalculateChangeArgs args) {
            return null;
        }
    }
}
