package com.example.cash_register.shared.exceptions;

import com.example.cash_register.TestConfig;
import org.hamcrest.Description;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;

import static com.example.cash_register.shared.exceptions.OnlyOneException.ForCollectionOfThrowable.collectionOfThrowableOnlyOneException;
import static com.example.cash_register.shared.exceptions.OnlyOneException.ForCompoundException.compoundExceptionOnlyOneException;
import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class OnlyOneExceptionMatcherTests {
    /**
     * Runs {@link OnlyOneException.ForCompoundException#describeTo(Description)}.
     */
    @Test
    public void compoundExceptionOnlyOneExceptionStaticMethodDescribeTo_test() {
        compoundExceptionOnlyOneException(Throwable.class).describeTo(Description.NONE);
    }

    /**
     * Runs {@link OnlyOneException.ForCollectionOfThrowable#describeTo(Description)}.
     */
    @Test
    public void collectionOfThrowableOnlyOneExceptionStaticMethodDescribeTo_test() {
        collectionOfThrowableOnlyOneException(Throwable.class).describeTo(Description.NONE);
    }

    /**
     * Runs the {@link OnlyOneException.ForCollectionOfThrowable#matches(Object)} method.
     */
    @Test
    public void matches_test() {
        final OnlyOneException.ForCollectionOfThrowable matcher = collectionOfThrowableOnlyOneException(Throwable.class);
        final boolean actual = matcher.matches(Collections.emptyList());
        MatcherAssert.assertThat(actual, equalTo(false));
    }
}
