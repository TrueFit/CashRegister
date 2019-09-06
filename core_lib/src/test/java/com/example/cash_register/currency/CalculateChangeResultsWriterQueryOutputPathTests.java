package com.example.cash_register.currency;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.nio.file.Path;

import static org.hamcrest.core.IsNull.notNullValue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class CalculateChangeResultsWriterQueryOutputPathTests {
    @Test
    public void queryOutputPath_test() {
        CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.createBuildDirectoryWriter();
        Path outputPath = writer.queryOutputPath();
        MatcherAssert.assertThat(outputPath, notNullValue());
    }

    @Test(expected = CalculateChangeResultsWriter.QueryOutputPathException.class)
    public void queryOutputPath_QueryOutputPathException_test() {
        CalculateChangeResultsWriter writer = CalculateChangeResultsWriter.create();
        writer.queryOutputPath();
    }
}
