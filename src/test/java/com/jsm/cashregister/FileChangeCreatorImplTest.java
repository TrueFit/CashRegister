package com.jsm.cashregister;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.powermock.api.mockito.PowerMockito;

import com.jsm.cashregister.dto.Denomination;

public class FileChangeCreatorImplTest {
  DenominationFormatter denominationFormatter;
  ChangeCreator changeCreator;
  FileChangeCreator fileChangeCreator;

  @Before
  public void before() {
    denominationFormatter = PowerMockito.mock(DenominationFormatter.class);
    changeCreator = PowerMockito.mock(ChangeCreator.class);

    fileChangeCreator = new FileChangeCreatorImpl(changeCreator, denominationFormatter);
  }

  @Test
  public void createChange() throws IOException, URISyntaxException {
    File tempOut = null;

    try {
      tempOut = File.createTempFile("output", ".txt");
      final URL inputFileUrl =
          this.getClass().getResource("/FileChangeCreatorImplTest.createChange.csv");
      final URI expectedFileUri =
          this.getClass().getResource("/FileChangeCreatorImplTest.createChange.output.txt").toURI();
      final File inputFile = new File(inputFileUrl.toURI());
      @SuppressWarnings("unchecked")
      final Map<Denomination, Integer> map1 = PowerMockito.mock(Map.class);
      @SuppressWarnings("unchecked")
      final Map<Denomination, Integer> map2 = PowerMockito.mock(Map.class);
      @SuppressWarnings("unchecked")
      final Map<Denomination, Integer> map3 = PowerMockito.mock(Map.class);
      final String value1 = "value1";
      final String value2 = "value2";
      final String value3 = "value3";
      final List<String> expected = Files.readAllLines(Paths.get(expectedFileUri));
      List<String> actual;

      PowerMockito.when(changeCreator.createChange(new BigDecimal("2.12"), new BigDecimal("3.00")))
          .thenReturn(map1);
      PowerMockito.when(changeCreator.createChange(new BigDecimal("1.97"), new BigDecimal("2.00")))
          .thenReturn(map2);
      PowerMockito.when(changeCreator.createChange(new BigDecimal("3.33"), new BigDecimal("5.00")))
          .thenReturn(map3);

      PowerMockito.when(denominationFormatter.formatDenominations(map1)).thenReturn(value1);
      PowerMockito.when(denominationFormatter.formatDenominations(map2)).thenReturn(value2);
      PowerMockito.when(denominationFormatter.formatDenominations(map3)).thenReturn(value3);

      fileChangeCreator.createChange(inputFile.getAbsolutePath(), tempOut.getAbsolutePath());

      actual = Files.readAllLines(tempOut.toPath());

      Assert.assertEquals(expected, actual);
    } finally {
      if (tempOut != null) {
        tempOut.delete();
      }
    }
  }
}
