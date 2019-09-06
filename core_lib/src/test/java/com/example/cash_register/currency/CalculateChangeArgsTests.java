package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Iterator;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsInstanceOf.instanceOf;
import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CalculateChangeArgsTests {
    @Test
    public void createIntentionallyInvalidArgs_test() {
        final CalculateChangeArgs intentionallyInvalidArgs = CalculateChangeArgs.createIntentionallyInvalidArgs();
        MatcherAssert.assertThat(intentionallyInvalidArgs, notNullValue());
        MatcherAssert.assertThat(intentionallyInvalidArgs.getInputArgsExceptionList(), hasSize(1));
        MatcherAssert.assertThat(intentionallyInvalidArgs.isValid(), equalTo(false));

        intentionallyInvalidArgs.addInputArgsException(new AnotherException());
        MatcherAssert.assertThat(intentionallyInvalidArgs.getInputArgsExceptionList(), hasSize(2));

        Iterator<Throwable> iterator = intentionallyInvalidArgs.getInputArgsExceptionList().iterator();
        Throwable firstException = iterator.next();
        Throwable secondException = iterator.next();
        MatcherAssert.assertThat(firstException, instanceOf(CalculateChangeArgs.IntentionallyInvalidArgsException.class));
        MatcherAssert.assertThat(secondException, instanceOf(AnotherException.class));
        MatcherAssert.assertThat(intentionallyInvalidArgs.isValid(), equalTo(false));
    }

    private static final class AnotherException extends RuntimeException {

    }
}
