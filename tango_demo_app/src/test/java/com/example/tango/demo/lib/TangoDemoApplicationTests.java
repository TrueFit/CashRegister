package com.example.tango.demo.lib;

import com.example.tango.demo.application.TangoDemoApplication;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@RunWith(SpringRunner.class)
public class TangoDemoApplicationTests {
    @Test
    public void tangoApplicationMainMethod_test() throws IOException {
        Path newTempDirectory = null;
        try {
            newTempDirectory = Files.createTempDirectory(RandomStringUtils.randomAlphabetic(10));

            final PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            final Resource resource = resolver.getResource("/com/example/tango/input/good_input.txt");

            final String filename = resource.getFilename();
            final Path inputFile = newTempDirectory.resolve(filename);

            try (InputStream inputStream = resource.getInputStream();
                 OutputStream outputStream = Files.newOutputStream(inputFile)) {

                IOUtils.copy(inputStream, outputStream);
                final String springBootCommandLineArgument =
                        String.format(
                                "--inputFile=%s",
                                inputFile.toAbsolutePath().toString());
                TangoDemoApplication.main(springBootCommandLineArgument);
            }
        }
        finally {
            if (newTempDirectory != null) {
                FileUtils.deleteQuietly(newTempDirectory.toFile());
            }
        }
    }
}
