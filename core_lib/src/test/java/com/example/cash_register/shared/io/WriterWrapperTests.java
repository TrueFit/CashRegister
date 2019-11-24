package com.example.cash_register.shared.io;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.util.UUID;

import static org.hamcrest.core.IsEqual.equalTo;

@SuppressWarnings("UnnecessaryLocalVariable")
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class WriterWrapperTests {
    @Autowired
    private WriterWrapper writerWrapper;

    @Test
    public void write_test() throws IOException {
        final String uuid = UUID.randomUUID().toString();
        final StringWriter stringWriter = new StringWriter();
        final BufferedWriter bufferedWriter = new BufferedWriter(stringWriter);

        try (bufferedWriter) {
            this.writerWrapper.write(bufferedWriter, uuid);
            this.writerWrapper.flush(bufferedWriter);

            final String expected = uuid;
            final String actual = stringWriter.toString();
            MatcherAssert.assertThat(actual, equalTo(expected));
        }
    }

    @Test(expected = WriterWrapper.WriteException.class)
    public void write_WriteException_test() {
        final BufferedWriter bufferedWriter = new BufferedWriter(new StringWriter());
        this.writerWrapper.write(bufferedWriter, null);
    }

    @Test
    public void writeLine_test() {
        final String uuid = UUID.randomUUID().toString();
        final StringWriter stringWriter = new StringWriter();
        final BufferedWriter bufferedWriter = new BufferedWriter(stringWriter);

        this.writerWrapper.writeLine(bufferedWriter, uuid);
        this.writerWrapper.flush(bufferedWriter);

        final String expected = uuid.concat(System.lineSeparator());
        final String actual = stringWriter.toString();
        MatcherAssert.assertThat(actual, equalTo(expected));
    }

    @Test(expected = WriterWrapper.WriteLineException.class)
    public void writeLine_WriteLineException_test() {
        this.writerWrapper.writeLine(null, null);
    }

    @Test(expected = WriterWrapper.NewLineException.class)
    public void newLine_NewLineException_test() {
        this.writerWrapper.newLine(null);
    }

    @Test(expected = WriterWrapper.FlushException.class)
    public void flush_FlushException_test() {
        this.writerWrapper.flush(null);
    }
}
