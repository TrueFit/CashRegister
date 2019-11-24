package com.example.tango.demo.lib;

import com.example.cash_register.shared.io.FilesWrapper;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import java.nio.file.Path;

/**
 * Spring component which creates and holds on to a reference to a temp directory.
 */
@Component(TempDirComponent.QUALIFIER)
@Getter(AccessLevel.PACKAGE)
class TempDirComponent {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.tango.demo.lib.TempDirComponent";

    /**
     * The temp directory.
     */
    private final Path tempDir;

    /**
     * Autowired constructor.
     *
     * @param filesWrapper See {@link FilesWrapper}; used to create {@link #tempDir}.
     */
    @Autowired
    private TempDirComponent(final FilesWrapper filesWrapper) {
        this.tempDir = filesWrapper.createTempDir();
    }

    /**
     * Deletes the temp directory when the application is shutting down.
     */
    @PreDestroy
    private void preDestroy() {
        FileUtils.deleteQuietly(tempDir.toFile());
    }
}
