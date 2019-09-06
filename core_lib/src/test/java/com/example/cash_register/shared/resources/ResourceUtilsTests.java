package com.example.cash_register.shared.resources;

import com.example.cash_register.TestConfig;
import com.example.cash_register.shared.TestUtils;
import org.apache.commons.lang3.StringUtils;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class ResourceUtilsTests {
    @Autowired
    private ResourceUtils resourceUtils;

    @Autowired
    private TestUtils testUtils;

    @Test(expected = ResourceStringValidator.ResourceStringIsBlankException.class)
    public void readLinesFromResource_ResourceStringIsBlankException_null_test() {
        this.resourceUtils.readLinesFromResource(null);
    }

    @Test(expected = ResourceStringValidator.ResourceStringIsBlankException.class)
    public void readLinesFromResource_ResourceStringIsBlankException_empty_test() {
        this.resourceUtils.readLinesFromResource(StringUtils.EMPTY);
    }

    @Test(expected = ResourceStringValidator.ResourceStringIsBlankException.class)
    public void readLinesFromResource_ResourceStringIsBlankException_whitespace_test() {
        this.resourceUtils.readLinesFromResource(StringUtils.SPACE);
    }

    @Test(expected = ResourceUtils.ReadLinesFromResourceException.class)
    public void readLinesFromResource_ReadLinesFromResourceException_test() {
        final String nonExistentResourceName = this.testUtils.generateNonExistentResourceName();
        this.resourceUtils.readLinesFromResource(nonExistentResourceName);
    }

    @Test
    public void readLinesFromResource_test() {
        final String resourceName = "/com/example/cash_register/shared/resources/readLinesFromResource_test.txt";
        final List<String> lines = this.resourceUtils.readLinesFromResource(resourceName);
        MatcherAssert.assertThat(lines, hasSize(5));
    }
}
