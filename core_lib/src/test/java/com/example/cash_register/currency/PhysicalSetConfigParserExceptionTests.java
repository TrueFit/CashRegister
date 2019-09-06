package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import com.example.cash_register.shared.StringConstants;
import com.example.cash_register.shared.TestUtils;
import com.example.cash_register.shared.exceptions.CompoundException;
import com.example.cash_register.shared.resources.ResourceStringValidator;
import org.apache.commons.lang3.StringUtils;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static com.example.cash_register.shared.exceptions.OnlyOneException.ForCompoundException.compoundExceptionOnlyOneException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class PhysicalSetConfigParserExceptionTests {
    @Autowired
    private PhysicalSetConfigParser parser;

    @Autowired
    private TestUtils testUtils;

    @Test(expected = ResourceStringValidator.ResourceStringIsBlankException.class)
    public void parseResources_ResourceStringIsBlankException_null_test() {
        this.parser.parseResources(null);
    }

    @Test(expected = ResourceStringValidator.ResourceStringIsBlankException.class)
    public void parseResources_ResourceStringIsBlankException_empty_test() {
        this.parser.parseResources(StringUtils.EMPTY);
    }

    @Test(expected = ResourceStringValidator.ResourceStringIsBlankException.class)
    public void parseResources_ResourceStringIsBlankException_whitespace_test() {
        this.parser.parseResources(StringUtils.SPACE);
    }

    @Test(expected = ResourceStringValidator.ResourceStringIsFullStopException.class)
    public void parseResources_ResourceStringIsFullStopException_test() {
        this.parser.parseResources(StringConstants.FULL_STOP);
    }

    @Test(expected = PhysicalSetConfigParser.FromResourceGetInputStreamException.class)
    public void parseResources_FromResourceGetInputStreamException_test() {
        try {
            final String nonExistentResourceName = this.testUtils.generateNonExistentResourceName();
            this.parser.parseResources(nonExistentResourceName);
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(
                    compoundException,
                    compoundExceptionOnlyOneException(PhysicalSetConfigParser.FromResourceGetInputStreamException.class));
            throw (PhysicalSetConfigParser.FromResourceGetInputStreamException) compoundException.getExceptionList().iterator().next();
        }
    }

    @Test(expected = PhysicalSetConfigParserResultCollection.Validator.DuplicateCurrencyException.class)
    public void parseResources_DuplicateCurrencyException_test() {
        this.parser.parseResources("/com/example/cash_register/currency/test_physical_sets/duplicate_currency/**/*.json");
    }

    @Test(expected = PhysicalSetConfigParserResult.DuplicateUnitValueException.class)
    public void parseResources_DuplicateUnitValueException_test() {
        try {
            this.parser.parseResources("/com/example/cash_register/currency/test_physical_sets/duplicate_unit_value/**/*.json");
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(compoundException, compoundExceptionOnlyOneException(PhysicalSetConfigParserResult.DuplicateUnitValueException.class));
            throw (PhysicalSetConfigParserResult.DuplicateUnitValueException) compoundException.getExceptionList().iterator().next();
        }
    }

    @Test(expected = PhysicalSetConfigParser.FromResourceReadValueException.class)
    public void parseResources_FromResourceReadValueException_test() {
        try {
            this.parser.parseResources("/com/example/cash_register/currency/test_physical_sets/read_value_fail/**/*.json");
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(compoundException,
                    compoundExceptionOnlyOneException(PhysicalSetConfigParser.FromResourceReadValueException.class));
            throw (PhysicalSetConfigParser.FromResourceReadValueException)
                    compoundException.getExceptionList().iterator().next();
        }
    }

    @Test(expected = PhysicalSetConfigParserResult.AllUnitValuesMustBePositiveException.class)
    public void parseResources_AllUnitValuesMustBePositiveException_withNegativeUnitValue_test() {
        try {
            this.parser.parseResources("/com/example/cash_register/currency/test_physical_sets/negative_unit_value/**/*.json");
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(compoundException,
                    compoundExceptionOnlyOneException(PhysicalSetConfigParserResult.AllUnitValuesMustBePositiveException.class));
            throw (PhysicalSetConfigParserResult.AllUnitValuesMustBePositiveException)
                    compoundException.getExceptionList().iterator().next();
        }
    }

    @Test(expected = PhysicalSetConfigParserResult.AllUnitValuesMustBePositiveException.class)
    public void parseResources_AllUnitValuesMustBePositiveException_withZeroUnitValue_test() {
        try {
            this.parser.parseResources("/com/example/cash_register/currency/test_physical_sets/zero_unit_value/**/*.json");
        }
        catch (final CompoundException compoundException) {
            MatcherAssert.assertThat(compoundException, compoundExceptionOnlyOneException(PhysicalSetConfigParserResult.AllUnitValuesMustBePositiveException.class));
            throw (PhysicalSetConfigParserResult.AllUnitValuesMustBePositiveException) compoundException.getExceptionList().iterator().next();
        }
    }
}
