package com.example.cash_register.shared.mappers;

import com.example.cash_register.TestConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.hamcrest.MatcherAssert;
import org.hamcrest.core.IsInstanceOf;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.UUID;

import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.StringContains.containsString;
import static org.mockito.Mockito.doThrow;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class JsonObjectMapperWrapperTests {
    @Autowired
    private JsonObjectMapperWrapper jsonObjectMapperWrapper;

    @SpyBean
    private ObjectMapper jsonObjectMapper;

    @After
    public void after() {
        Mockito.reset(this.jsonObjectMapper);
    }

    @Test
    public void prettyWriteValueAsString_test() {
        final UUID uuid = UUID.randomUUID();
        final String expected = uuid.toString();
        final String actual = this.jsonObjectMapperWrapper.prettyWriteValueAsString(expected);
        MatcherAssert.assertThat(actual, notNullValue());
        MatcherAssert.assertThat(actual, containsString(expected));
    }

    @Test(expected = JsonObjectMapperWrapper.PrettyWriteValueAsStringException.class)
    public void prettyWriteValueAsString_PrettyWriteValueAsStringException_test() {
        doThrow(new MockPrettyWriteValueAsStringException())
                .when(this.jsonObjectMapper)
                .writerWithDefaultPrettyPrinter();
        try {
            this.jsonObjectMapperWrapper.prettyWriteValueAsString(StringUtils.EMPTY);
        }
        catch (final JsonObjectMapperWrapper.PrettyWriteValueAsStringException exception) {
            final Throwable rootCause = ExceptionUtils.getRootCause(exception);
            MatcherAssert.assertThat(rootCause, IsInstanceOf.instanceOf(MockPrettyWriteValueAsStringException.class));
            throw exception;
        }
    }

    private static final class MockPrettyWriteValueAsStringException extends RuntimeException {

    }
}
