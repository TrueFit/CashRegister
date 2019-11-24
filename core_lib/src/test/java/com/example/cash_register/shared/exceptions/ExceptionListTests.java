package com.example.cash_register.shared.exceptions;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Collection;

import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class ExceptionListTests {
    @Test
    public void constructor_withCollectionOfThrowable_test() {
        final Collection<Throwable> expected = new ArrayList<>();
        expected.add(new MockException1());
        expected.add(new MockException2());

        final ExceptionList actual = new ExceptionList(expected);
        MatcherAssert.assertThat(actual, containsInAnyOrder(expected.toArray(new Throwable[0])));
    }

    private static final class MockException1 extends RuntimeException {

    }

    private static final class MockException2 extends RuntimeException {

    }
}
