package com.example.tango.demo.lib;

import com.example.tango.demo.MockTestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = MockTestConfig.class)
public class JsonOutputFrameCreatorTests {
    @Autowired
    private JsonOutputFrameCreator jsonOutputFrameCreator;

    @Test(expected = JsonOutputFrameCreator.CreateFrameException.class)
    public void createFrame_CreateFrameException_test() {
        this.jsonOutputFrameCreator.createFrame(null);
    }

    @Test(expected = OutputFrameCreatorBase.CreateOutputPaneComponentsArrayNullException.class)
    public void createOutputFrame_CreateOutputPaneComponentsArrayNullException_test() {
        this.jsonOutputFrameCreator.createOutputFrame(1, (java.awt.Component[]) null);
    }
}
