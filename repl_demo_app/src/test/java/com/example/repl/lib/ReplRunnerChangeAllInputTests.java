package com.example.repl.lib;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.InputStream;

/**
 * Uses the resource file {@code `/com/example/repl/lib/input/change_all_input.txt`} as input to run an automated REPL
 * test, which will change each available value.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ReplRunnerChangeAllInputTests.MockInputConfig.class)
public class ReplRunnerChangeAllInputTests {
    @Autowired
    private CompleteRepl completeRepl;

    /**
     * {@link ReplBase.ExitInterruptException} is considered a normal end for this application, as it signifies that the
     * user input {@code /exit} to exit the application.
     */
    @Test(expected = ReplBase.ExitInterruptException.class)
    public void doRepl_changeAllInput_test() {
        this.completeRepl.doRepl();
    }

    @SuppressWarnings("UnnecessaryLocalVariable")
    @Configuration
    @Import(TestConfig.class)
    static class MockInputConfig {
        @Bean
        InputStream inputStream() {
            InputStream inputStream = this.getClass().getResourceAsStream("/com/example/repl/lib/input/change_all_input.txt");
            return inputStream;
        }
    }
}
