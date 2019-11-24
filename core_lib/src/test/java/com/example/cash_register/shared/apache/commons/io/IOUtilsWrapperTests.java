package com.example.cash_register.shared.apache.commons.io;

import com.example.cash_register.TestConfig;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import static org.hamcrest.core.IsEqual.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class IOUtilsWrapperTests {
    @Autowired
    private IOUtilsWrapper ioUtilsWrapper;

    @Test
    public void toString_withInputStreamAndCharset_test() {
        final UUID uuid = UUID.randomUUID();
        final String expected = uuid.toString();
        final InputStream inputStream = new ByteArrayInputStream(expected.getBytes(StandardCharsets.UTF_8));
        final String actual = this.ioUtilsWrapper.toString(inputStream, StandardCharsets.UTF_8);

        MatcherAssert.assertThat(actual, equalTo(expected));
    }

    @Test(expected = IOUtilsWrapper.ToStringWithInputStreamAndCharsetException.class)
    public void toString_withInputStreamAndCharset_ToStringWithInputStreamAndCharsetException_test() {
        final String actual = this.ioUtilsWrapper.toString(null, null);
    }

    @Test
    public void copy_withInputStreamAndOutputStream_test() {
        final UUID uuid = UUID.randomUUID();
        final String expected = uuid.toString();
        final InputStream inputStream = new ByteArrayInputStream(expected.getBytes(StandardCharsets.UTF_8));
        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        this.ioUtilsWrapper.copy(inputStream, outputStream);

        String actual = new String(outputStream.toByteArray(), StandardCharsets.UTF_8);

        MatcherAssert.assertThat(actual, equalTo(expected));
    }

    @Test(expected = IOUtilsWrapper.CopyWithInputStreamAndOutputStreamException.class)
    public void copy_withInputStreamAndOutputStream_CopyWithInputStreamAndOutputStreamException_test() {
        this.ioUtilsWrapper.copy(null, null);
    }
}
