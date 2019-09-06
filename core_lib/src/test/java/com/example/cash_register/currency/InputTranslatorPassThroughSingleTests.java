package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.core.IsSame.sameInstance;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class InputTranslatorPassThroughSingleTests {
    @Autowired
    private InputTranslatorPassThroughSingle inputTranslator;

    @Test
    public void translate_test() {
        CalculateChangeArgs args = CalculateChangeArgs.createIntentionallyInvalidArgs();
        CalculateChangeArgs actual = this.inputTranslator.translate(args);
        MatcherAssert.assertThat(actual, sameInstance(args));
    }
}
