package com.example.tango.demo.lib;

import com.example.tango.lib.TangoProperties;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.awt.FileDialog;
import java.io.File;
import java.nio.file.Path;

/**
 * A simple file chooser component, used to select a file to process.
 */
@Component(FileChooser.QUALIFIER)
class FileChooser {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.tango.demo.lib.FileChooser";
    /**
     * The file dialog UI element.
     */
    @Autowired
    private FileDialog fileDialog;

    /**
     * Application properties.
     */
    @Autowired
    private TangoProperties tangoProperties;

    /**
     * Chooses a file.
     *
     * @param startingPath The directory to start in with the file chooser.
     *
     * @return The chosen file.
     */
    Path chooseFile(final Path startingPath) {
        Path path = null;
        this.fileDialog.setDirectory(startingPath.toAbsolutePath().toString());
        this.fileDialog.setVisible(true);
        final File[] fileArray = this.fileDialog.getFiles();
        if (ArrayUtils.isNotEmpty(fileArray)) {
            path = fileArray[0].toPath();
        }
        return path;
    }
}
