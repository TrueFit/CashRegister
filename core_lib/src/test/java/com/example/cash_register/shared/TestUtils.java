package com.example.cash_register.shared;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.net.URL;
import java.util.function.Supplier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.spy;

@Component(TestUtils.QUALIFIER)
public class TestUtils {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "TestUtils";

    /**
     * Generates a random string, which is specifically tested, such that it does not reference an existing resource
     * name.
     *
     * @return A random string which does not reference an existing resource name.
     */
    public String generateNonExistentResourceName() {
        URL url;
        String resourceName;
        do {
            resourceName = RandomStringUtils.randomAlphabetic(100);
            url = this.getClass().getResource(resourceName);
        }
        while (url != null);

        return resourceName;
    }

    /**
     * Create a mock writer which will exception when {@link Writer#write(String)} or {@link Writer#write(char[], int,
     * int)} is invoked.
     *
     * @param runtimeExceptionSupplier Supplies the exception instance to be thrown.
     *
     * @return Mocked {@link Writer}.
     *
     * @see Writer#write(String)
     * @see Writer#write(char[], int, int)
     */
    public Writer mockWriterExceptionOnWrite(Supplier<RuntimeException> runtimeExceptionSupplier) {
        final StringWriter mock = spy(StringWriter.class);
        doThrow(runtimeExceptionSupplier.get())
                .when(mock)
                .write(any(char[].class), anyInt(), anyInt());
        doThrow(runtimeExceptionSupplier.get())
                .when(mock)
                .write(anyString());
        return mock;
    }

    /**
     * Create a mock writer which will exception when {@link Writer#close()} is invoked.
     *
     * @param runtimeExceptionSupplier Supplies the exception instance to be thrown.
     *
     * @return Mocked {@link Writer}.
     *
     * @see Writer#close()
     */
    public Writer mockWriterExceptionOnClose(Supplier<RuntimeException> runtimeExceptionSupplier) {
        final StringWriter mock = spy(StringWriter.class);
        try {
            doThrow(runtimeExceptionSupplier.get())
                    .when(mock)
                    .close();
        }
        catch (final IOException ioException) {
            throw new IOExceptionWrapper(ioException);
        }
        return mock;
    }

    /**
     * See {@link #mockWriterExceptionOnClose(Supplier)}
     *
     * @see #mockWriterExceptionOnClose(Supplier)
     */
    public static final class IOExceptionWrapper extends RuntimeException {
        private IOExceptionWrapper(Throwable cause) {
            super("an IOException was thrown during mock writer close invocation", cause);
        }
    }
}
