package com.example.tango.demo.lib;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.awt.FileDialog;
import java.awt.Frame;

/**
 * Spring beans for file dialog.
 */
@Configuration
class FileDialogConfig {
    /**
     * Spring qualifier.
     */
    static final String FILE_DIALOG_QUALIFIER = "com.example.tango.demo.lib.FileDialogConfig.fileDialog";

    /**
     * The bean for {@link FileDialog}.
     *
     * @return The bean for {@link FileDialog}.
     */
    @Bean(FILE_DIALOG_QUALIFIER)
    FileDialog fileDialog() {
        return new FileDialog((Frame) null, "File Dialog", FileDialog.LOAD);
    }
}
