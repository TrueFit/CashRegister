package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.InputStream;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CalculateChangeArgsInputModelParserTests {
    @Autowired
    private CalculateChangeArgs.InputModelParser inputModelParser;

    @Test(expected = CalculateChangeArgs.InputModelParser.ParseInputStreamObjectMapperReadValueException.class)
    public void inputModelParser_ParseInputStreamObjectMapperReadValueException_test() {
        this.inputModelParser.parse(null);
    }

    @Test(expected = CalculateChangeArgs.InputModelParser.ParseInputModelException.class)
    public void inputModelParser_ParseInputModelException_test() {
        InputStream inputStream = this.getClass().getResourceAsStream("/com/example/cash_register/currency/input_sets/non_parsable_input_model.json");
        this.inputModelParser.parse(inputStream);
    }
}
