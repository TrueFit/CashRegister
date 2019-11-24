package com.example.cash_register.shared.resources;

import com.example.cash_register.TestConfig;
import com.example.cash_register.shared.TestUtils;
import com.example.cash_register.shared.io.FilesWrapper;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.comparator.NameFileComparator;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsInstanceOf.instanceOf;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.StringContains.containsString;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestConfig.class)
public class SpringResourceUtilsTests {
    @Autowired
    private SpringResourceUtils springResourceUtils;

    @Autowired
    private FilesWrapper filesWrapper;

    @Autowired
    private TestUtils testUtils;

    @Test(expected = SpringResourceUtils.GetSpringResourcesByLocationPatternException.class)
    public void getSpringResources_GetSpringResourcesByLocationPatternException_test() throws IOException {
        final PathMatchingResourcePatternResolver mock = mock(PathMatchingResourcePatternResolver.class);
        doThrow(new MockGetSpringResourcesException())
                .when(mock)
                .getResources(anyString());
        try {
            this.springResourceUtils.getSpringResources("anything", mock);
        }
        catch (final SpringResourceUtils.GetSpringResourcesByLocationPatternException exception) {
            final Throwable rootCause = ExceptionUtils.getRootCause(exception);
            MatcherAssert.assertThat(rootCause, instanceOf(MockGetSpringResourcesException.class));
            throw exception;
        }
    }

    @Test
    public void getSpringResource_test() {
        final Resource resource = this.springResourceUtils.getSpringResource("/cash_register.properties");
        MatcherAssert.assertThat(resource.exists(), equalTo(true));
    }

    @Test
    public void copyLocationToSystemTempDir_test() {
        final Path file = this.springResourceUtils.copyLocationToSystemTempDir("/cash_register.properties");
        MatcherAssert.assertThat(file, notNullValue());
        MatcherAssert.assertThat(Files.exists(file), equalTo(true));
        FileUtils.deleteQuietly(file.toFile());
    }

    @Test
    public void copyLocationPatternArrayToTempDir_test() {
        final Path tempDir = this.springResourceUtils.copyLocationPatternArrayToTempDir(
                "/com/example/cash_register/currency/copy_sources/spring_resource_utils_1/file1.txt",
                "/com/example/cash_register/currency/copy_sources/spring_resource_utils_1/file2.txt",
                "/com/example/cash_register/currency/copy_sources/spring_resource_utils_2/**/*.txt");

        try {
            final Collection<File> fileCollection = FileUtils.listFiles(tempDir.toFile(), null, false);
            final List<File> fileList = fileCollection
                    .stream()
                    .sorted(NameFileComparator.NAME_COMPARATOR)
                    .collect(Collectors.toUnmodifiableList());
            MatcherAssert.assertThat(fileList, notNullValue());
            MatcherAssert.assertThat(fileList, hasSize(4));

            List<Path> pathList = fileList
                    .stream()
                    .map(File::toPath)
                    .collect(Collectors.toUnmodifiableList());
            MatcherAssert.assertThat(Files.exists(pathList.get(0)), equalTo(true));
            MatcherAssert.assertThat(Files.exists(pathList.get(1)), equalTo(true));
            MatcherAssert.assertThat(Files.exists(pathList.get(2)), equalTo(true));
            MatcherAssert.assertThat(Files.exists(pathList.get(3)), equalTo(true));

            final List<String> uuidList = pathList
                    .stream()
                    .map(this.filesWrapper::readString)
                    .collect(Collectors.toUnmodifiableList());
            MatcherAssert.assertThat(uuidList.get(0), containsString("7c14f0bd-9d1f-48b5-93cf-53da6026deba"));
            MatcherAssert.assertThat(uuidList.get(1), containsString("345556f5-4201-4e56-82e1-31accfb749f0"));
            MatcherAssert.assertThat(uuidList.get(2), containsString("680921db-8c0b-4905-a04b-576f2dc1e608"));
            MatcherAssert.assertThat(uuidList.get(3), containsString("8f222219-87fc-4443-b5ab-d56009738ab6"));
        }
        finally {
            FileUtils.deleteQuietly(tempDir.toFile());
        }
    }

    @Test(expected = SpringResourceUtils.CopyLocationPatternToTempDirLocationPatternArrayEmptyException.class)
    public void copyLocationPatternArrayToTempDir_CopyLocationPatternToTempDirLocationPatternArrayEmptyException_test() {
        this.springResourceUtils.copyLocationPatternArrayToTempDir();
    }

    @Test(expected = SpringResourceUtils.CopyLocationPatternToTempDirLocationPatternArrayNullException.class)
    public void copyLocationPatternArrayToTempDir_CopyLocationPatternToTempDirLocationPatternArrayNullException_test() {
        this.springResourceUtils.copyLocationPatternArrayToTempDir((String[]) null);
    }

    @Test(expected = SpringResourceUtils.CopyLocationPatternToTempDirException.class)
    public void copyLocationPatternArrayToTempDir_CopyLocationPatternToTempDirException_test() {
        final String locationPattern = this.testUtils.generateNonExistentResourceName();
        this.springResourceUtils.copyLocationPatternArrayToTempDir(locationPattern);
    }

    @Test(expected = SpringResourceUtils.CopyResourceToDirNullResourceException.class)
    public void copyResourceToDir_CopyResourceToDirNullResourceException_test() {
        final Path tempDir = this.filesWrapper.createTempDir();
        try {
            this.invokeCopyResourceToDir(tempDir, null);
        }
        finally {
            FileUtils.deleteQuietly(tempDir.toFile());
        }
    }

    @Test(expected = SpringResourceUtils.CopyResourceToDirResourceDoesNotExistException.class)
    public void copyResourceToDir_CopyResourceToDirResourceDoesNotExistException_test() {
        final String location = this.testUtils.generateNonExistentResourceName();
        final Path tempDir = this.filesWrapper.createTempDir();
        try {
            final Resource resource = this.springResourceUtils.getSpringResource(location);
            this.invokeCopyResourceToDir(tempDir, resource);
        }
        finally {
            FileUtils.deleteQuietly(tempDir.toFile());
        }
    }

    @Test(expected = SpringResourceUtils.CopyResourceToDirNullTargetException.class)
    public void copyResourceToDir_CopyResourceToDirNullTargetException_test() {
        final Resource resource = mock(Resource.class);
        this.invokeCopyResourceToDir(null, resource);
    }

    @Test(expected = SpringResourceUtils.CopyResourceToDirTargetDoesNotExistException.class)
    public void copyResourceToDir_CopyResourceToDirTargetDoesNotExistException_test() {
        final Resource resource = mock(Resource.class);
        final Path tempDir = this.filesWrapper.createTempDir();
        final Path nonExistentPath = tempDir.resolve("anything");
        try {
            this.invokeCopyResourceToDir(nonExistentPath, resource);
        }
        finally {
            FileUtils.deleteQuietly(tempDir.toFile());
        }
    }

    @Test(expected = SpringResourceUtils.CopyResourceToDirResourceNullFilenameException.class)
    public void copyResourceToDir_CopyResourceToDirResourceNullFilenameException_test() {
        final Resource resource = mock(Resource.class);
        doReturn(true)
                .when(resource)
                .exists();
        final Path tempDir = this.filesWrapper.createTempDir();
        try {
            this.invokeCopyResourceToDir(tempDir, resource);
        }
        finally {
            FileUtils.deleteQuietly(tempDir.toFile());
        }
    }

    @Test(expected = SpringResourceUtils.CopyResourceToDirIOUtilsCopyException.class)
    public void copyResourceToDir_CopyResourceToDirIOUtilsCopyException_test() {
        final Path tempDir = this.filesWrapper.createTempDir();
        final Resource resource = mock(Resource.class);
        doReturn(true).when(resource).exists();
        doReturn("filename").when(resource).getFilename();
        try {
            this.invokeCopyResourceToDir(tempDir, resource);
        }
        finally {
            FileUtils.deleteQuietly(tempDir.toFile());
        }
    }

    private void invokeCopyResourceToDir(final Path target, final Resource resource) {
        ReflectionTestUtils.invokeMethod(
                this.springResourceUtils,
                "copyResourceToDir",
                target,
                resource);
    }

    private static final class MockGetSpringResourcesException extends RuntimeException {

    }
}
