package com.example.cash_register.shared.random;

import com.example.cash_register.TestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class RandomUtilsTests {
    @Test(expected = RandomUtils.GetRandomElementArrayNullException.class)
    public void getRandomElement_GetRandomElementArrayNullException_test() {
        RandomUtils.getInstance().getRandomElement(null);
    }

    @Test(expected = RandomUtils.GetRandomElementArrayEmptyException.class)
    public void getRandomElement_GetRandomElementArrayEmptyException_test() {
        RandomUtils.getInstance().getRandomElement(new Object[0]);
    }

    @Test(expected = RandomUtils.GetRandomElementArrayHasSizeOneException.class)
    public void getRandomElement_GetRandomElementArrayHasSizeOneException_test() {
        RandomUtils.getInstance().getRandomElement(new Object[1]);
    }
}
