package com.jsm.cashregister;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import com.jsm.cashregister.dto.Denomination;
import com.jsm.cashregister.exception.InputFileException;
import com.jsm.cashregister.exception.OutputFileException;

/**
 * Provides an implementation to read from a file specified in CSV format (owed,paid) and output
 * using provided denomination formatter
 * 
 * @author Joshua
 *
 */
public class FileChangeCreatorImpl implements FileChangeCreator {
  ChangeCreator changeCreator;
  DenominationFormatter denominationFormatter;

  /**
   * File reader/writter using given creator and formatter
   * 
   * @param changeCreator change creator to use to generate denominations
   * @param denominationFormatter format to provide string output of results
   */
  public FileChangeCreatorImpl(ChangeCreator changeCreator,
      DenominationFormatter denominationFormatter) {
    super();
    this.changeCreator = changeCreator;
    this.denominationFormatter = denominationFormatter;
  }

  /**
   * create change for given file input and output paths, using input one for line with (owed, paid)
   * of csv files
   */
  @Override
  public void createChange(String inputFilePath, String outputFilePath) {
    List<String> outputLines = new ArrayList<>();

    // read input file
    try (Stream<String> stream = Files.lines(Paths.get(inputFilePath))) {

      stream.forEach(line -> {
        String[] input = line.split(",");
        BigDecimal cost = new BigDecimal(input[0]);
        BigDecimal paid = new BigDecimal(input[1]);

        Map<Denomination, Integer> changeForLine = changeCreator.createChange(cost, paid);

        outputLines.add(denominationFormatter.formatDenominations(changeForLine));
      });

    } catch (IOException e) {
      throw new InputFileException("Could not read input file", e);
    }

    // write output
    try {
      FileChangeCreatorImpl.writeOuput(outputFilePath, outputLines);
    } catch (IOException e) {
      throw new OutputFileException("Could not write output file", e);
    }
  }

  /**
   * write the output results to the file
   * 
   * @param outputFilePath file path to append to
   * @param outputLines the lines to write
   * @throws IOException
   */
  private static void writeOuput(String outputFilePath, List<String> outputLines)
      throws IOException {
    Files.write(Paths.get(outputFilePath), outputLines, StandardCharsets.UTF_8,
        StandardOpenOption.APPEND, StandardOpenOption.CREATE);
  }
}
