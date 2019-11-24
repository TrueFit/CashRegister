package com.example.cash_register.shared.exceptions;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.StringContains.containsString;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CompoundExceptionTests {
    @Test
    public void toString_test() {
        final int count = 100;
        final List<String> uuidList = Stream
                .generate(UUID::randomUUID)
                .limit(count)
                .map(UUID::toString)
                .collect(Collectors.toUnmodifiableList());
        final List<Throwable> listOfThrowable = uuidList
                .stream()
                .map(RuntimeException::new)
                .collect(Collectors.toUnmodifiableList());

        final CompoundException compoundException = new CompoundException(listOfThrowable);
        MatcherAssert.assertThat(compoundException.getExceptionList(), hasSize(count));

        final String toString = compoundException.toString();
        for (final String uuid : uuidList) {
            MatcherAssert.assertThat(toString, containsString(uuid));
        }
    }
}
