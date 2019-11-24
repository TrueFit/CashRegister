package com.example.tango.demo.lib;

import com.example.cash_register.currency.CashRegisterProperties;
import com.example.cash_register.shared.io.FilesWrapper;
import com.example.tango.lib.TangoProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.swing.BoxLayout;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.SwingConstants;
import javax.swing.WindowConstants;
import java.awt.Container;
import java.awt.Frame;
import java.awt.GridLayout;
import java.math.BigInteger;
import java.nio.file.Path;
import java.util.Currency;
import java.util.Locale;

/**
 * Base class containing various methods used to generate a simple demonstration UI with the results of calculate change
 * file processing. Generates a configuration information pane, an input file pane, an output file pane, and an error
 * file pane by putting together various Swing components.
 */
@SuppressWarnings("UnnecessaryLocalVariable")
@Component /* abstract */
abstract class OutputFrameCreatorBase {
    /**
     * Temp directory.
     */
    @Autowired
    private TempDirComponent tempDirComponent;

    /**
     * Cash Register properties.
     */
    @Autowired
    private CashRegisterProperties cashRegisterProperties;

    /**
     * Application properties.
     */
    @Autowired
    private TangoProperties tangoProperties;

    /**
     * Files wrapper
     */
    @Autowired
    private FilesWrapper filesWrapper;

    /**
     * Subclasses must implement this to create their output frame.
     *
     * @param args Create frame args.
     *
     * @return The created frame.
     */
    abstract JFrame createFrame(final CreateOutputFrameArgs args);

    /**
     * Creates input pane from the provided args.
     *
     * @param args Create frame args.
     *
     * @return The input pane.
     */
    JScrollPane createInputPane(final CreateOutputFrameArgs args) {
        return this.createFileContentPane(" INPUT: ", args.getInputFile());
    }

    /**
     * Creates output pane from the provided args.
     *
     * @param title Title of the output pane.
     * @param args Create output frame args.
     *
     * @return The output pane.
     */
    JScrollPane createOutputFrame(final String title, final CreateOutputFrameArgs args) {
        return this.createFileContentPane(title, args.getOutputFile());
    }

    /**
     * Creates error pane from the provided args.
     *
     * @param args Create frame args.
     *
     * @return The error pane.
     */
    JScrollPane createErrorPane(final CreateOutputFrameArgs args) {
        return this.createFileContentPane(" ERROR DETAILS: ", args.getErrorFile());
    }

    /**
     * Creates the complete output pane.
     *
     * @param rows Rows, per {@link GridLayout#GridLayout(int, int)}.
     * @param components The components for the output pane, per {@link JFrame#add(java.awt.Component)}.
     *
     * @return The complete output pane.
     */
    JFrame createOutputFrame(final int rows, final java.awt.Component... components) {
        if (components == null) {
            throw new CreateOutputPaneComponentsArrayNullException();
        }
        final JFrame frame = new JFrame();
        frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        frame.setTitle("Tango Demo Application");
        final GridLayout gridLayout = new GridLayout(rows, 1);
        frame.setLayout(gridLayout);
        frame.setExtendedState(Frame.MAXIMIZED_BOTH);
        for (final java.awt.Component component : components) {
            frame.add(component);
        }
        return frame;
    }

    /**
     * Creates a file content scroll pane.
     *
     * @param title Title of the scroll pane.
     * @param path The file with which to populate the scroll pane.
     *
     * @return The scroll pane.
     */
    private JScrollPane createFileContentPane(final String title, final Path path) {
        final String text = this.filesWrapper.readString(path);
        final JLabel label = this.createLabel(title + path.toString());

        final JTextArea textArea = this.createTextArea(text);

        final JPanel inputPanel = this.createPanel();
        inputPanel.add(label);
        inputPanel.add(textArea);

        final BoxLayout layout = this.createBoxLayout(inputPanel);
        inputPanel.setLayout(layout);

        final JScrollPane scrollPane = this.createScrollPane(inputPanel);
        return scrollPane;
    }

    /**
     * Creates the configuration information pane.
     *
     * @return The configuration information pane, containing configured currency, locale, and random change divisor.
     */
    JScrollPane createConfigurationInformationPane() {
        final Locale inputLocale = this.cashRegisterProperties.getInputLocale();
        final Locale outputLocale = this.cashRegisterProperties.getOutputLocale();
        final Currency currency = this.cashRegisterProperties.getCurrency();
        final BigInteger randomChangeDivisor = this.tangoProperties.getRandomChangeDivisor();

        final JLabel currencyLabel = this.createLabel(" Configured Currency: " + currency.toString());
        final JLabel inputLocaleLabel = this.createLabel(" Configured Input Locale: " + inputLocale.toLanguageTag());
        final JLabel outputLocaleLabel = this.createLabel(" Configured Output Locale: " + outputLocale.toLanguageTag());
        final JLabel randomChangeDivisorLabel = this.createLabel(" Configured Random Change Divisor: " + randomChangeDivisor.toString());
        final JLabel temporaryFileDeletionWarningLabel = this.createLabel(
                " The temporary files displayed below will be deleted when this application is closed.");

        final JPanel panel = this.createPanel();
        panel.add(currencyLabel);
        panel.add(inputLocaleLabel);
        panel.add(outputLocaleLabel);
        panel.add(randomChangeDivisorLabel);
        panel.add(temporaryFileDeletionWarningLabel);

        final BoxLayout layout = this.createBoxLayout(panel);
        panel.setLayout(layout);

        final JScrollPane scrollPane = this.createScrollPane(panel);
        return scrollPane;
    }

    /**
     * Creates a label.
     *
     * @param text The text of the label, per {@link JLabel#JLabel(String)}.
     *
     * @return The label.
     */
    private JLabel createLabel(final String text) {
        final JLabel label = new JLabel(text);
        label.setHorizontalAlignment(SwingConstants.LEFT);
        return label;
    }

    /**
     * Creates a panel.
     *
     * @return The panel.
     */
    private JPanel createPanel() {
        final JPanel panel = new JPanel();
        panel.setAlignmentX(java.awt.Component.LEFT_ALIGNMENT);
        return panel;
    }

    /**
     * Creates a box layout.
     *
     * @param target The target for the box layout, per {@link BoxLayout#BoxLayout(Container, int)}.
     *
     * @return The box layout.
     */
    private BoxLayout createBoxLayout(final Container target) {
        final BoxLayout layout = new BoxLayout(target, BoxLayout.PAGE_AXIS);
        return layout;
    }

    /**
     * Creates a scroll pane.
     *
     * @param view The view for the box layout, per {@link JScrollPane#JScrollPane(java.awt.Component)}.
     *
     * @return The scroll pane.
     */
    private JScrollPane createScrollPane(final Container view) {
        final JScrollPane scrollPane = new JScrollPane(view);
        scrollPane.setAlignmentX(java.awt.Component.LEFT_ALIGNMENT);
        return scrollPane;
    }

    /**
     * Creates a text area.
     *
     * @param text The text for the text area, per {@link JTextArea#JTextArea(String)}.
     *
     * @return The text area.
     */
    private JTextArea createTextArea(final String text) {
        final JTextArea textArea = new JTextArea(text);
        textArea.setAlignmentX(java.awt.Component.LEFT_ALIGNMENT);
        textArea.setEditable(false);
        return textArea;
    }

    /**
     * See {@link #createOutputFrame(int, java.awt.Component...)}.
     *
     * @see #createOutputFrame(int, java.awt.Component...)
     */
    static final class CreateOutputPaneComponentsArrayNullException extends RuntimeException {
        CreateOutputPaneComponentsArrayNullException() {
            super("components array must not be null");
        }
    }
}
