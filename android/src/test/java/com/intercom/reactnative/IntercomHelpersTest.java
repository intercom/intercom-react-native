package com.intercom.reactnative;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mockStatic;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.WritableMap;

import io.intercom.android.sdk.identity.Registration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.MockedStatic;

public class IntercomHelpersTest {

  private MockedStatic<Arguments> argumentsMock;

  @Before
  public void setUp() {
    argumentsMock = mockStatic(Arguments.class);
    argumentsMock.when(Arguments::createMap).thenAnswer(invocation -> new JavaOnlyMap());
  }

  @After
  public void tearDown() {
    argumentsMock.close();
  }

  // Regression guard for intercom/intercom#520691: a null Registration arrives here whenever
  // Intercom.client().fetchLoggedInUserAttributes() returns null (no logged-in user, app
  // re-launched after OS kill, etc.). Before the fix, this crashed the host process with
  // NullPointerException on registration.getEmail().
  @Test
  public void deconstructRegistration_returnsEmptyMap_whenRegistrationIsNull() {
    WritableMap result = IntercomHelpers.deconstructRegistration(null);

    assertNotNull("expected an empty map, not null", result);
    JavaOnlyMap map = (JavaOnlyMap) result;
    assertFalse("expected no email key when registration is null", map.hasKey("email"));
    assertFalse("expected no userId key when registration is null", map.hasKey("userId"));
  }

  @Test
  public void deconstructRegistration_returnsBothFields_whenRegistrationIsFullyPopulated() {
    Registration registration = new Registration()
        .withEmail("test@example.com")
        .withUserId("user-42");

    WritableMap result = IntercomHelpers.deconstructRegistration(registration);
    JavaOnlyMap map = (JavaOnlyMap) result;

    assertTrue(map.hasKey("email"));
    assertEquals("test@example.com", map.getString("email"));
    assertTrue(map.hasKey("userId"));
    assertEquals("user-42", map.getString("userId"));
  }
}
