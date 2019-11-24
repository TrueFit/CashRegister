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
 * Uses the resource file {@code `/com/example/repl/lib/input/unsuccessful_result_input.txt`} as input to run an
 * automated REPL test, which will cause an {@link ReplWorkflowRunner.UnsuccessfulResultException} by using bad input.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ReplRunnerUnsuccessfulResultInputTests.MockInputConfig.class)
public class ReplRunnerUnsuccessfulResultInputTests {
    @Autowired
    private CompleteRepl completeRepl;

    @Test(expected = ReplWorkflowRunner.UnsuccessfulResultException.class)
    public void doRepl_UnsuccessfulResultException_test() {
        this.completeRepl.doRepl();
    }

    @SuppressWarnings("UnnecessaryLocalVariable")
    @Configuration
    @Import(TestConfig.class)
    static class MockInputConfig {
        @Bean
        InputStream inputStream() {
            final InputStream inputStream = this.getClass().getResourceAsStream("/com/example/repl/lib/input/unsuccessful_result_input.txt");
            return inputStream;
        }
    }
}
