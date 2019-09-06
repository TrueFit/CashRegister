package com.example.repl.lib;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class DisableHistoryTests {
    @Autowired
    private DisableHistory disableHistory;

    @Test
    public void disableHistory_test() {
        this.disableHistory.save();
    }
}
