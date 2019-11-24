package com.example.tango.lib;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class TangoInputParserTests {
    @Autowired
    private TangoInputParser tangoInputParser;

    @Test(expected = TangoInputParser.ReadLinesFromInputStreamException.class)
    public void parseInput_ReadLinesFromInputStreamException_test() {
        this.tangoInputParser.parseImpl(null);
    }
}
