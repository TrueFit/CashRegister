package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static com.example.cash_register.CurrencyValueConstantsForTests.USD_NICKEL_VALUE;
import static com.example.cash_register.CurrencyValueConstantsForTests.USD_PENNY_VALUE;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsSame.sameInstance;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class InputParserPassThroughSingleTests {
    @Autowired
    private InputParserPassThroughSingle inputParser;

    @Test
    public void parseInput_test() {
        CalculateChangeArgs args = CalculateChangeArgs.builder()
                .owed(USD_PENNY_VALUE)
                .tendered(USD_NICKEL_VALUE)
                .build();
        List<CalculateChangeArgs> argsList = this.inputParser.parse(args);
        MatcherAssert.assertThat(argsList, hasSize(1));
        MatcherAssert.assertThat(argsList.get(0), sameInstance(args));
    }
}
