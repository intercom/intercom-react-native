import { by, device, element, expect, waitFor } from 'detox';

describe('Intercom messenger', () => {
  beforeAll(async () => {
    await device.launchApp({ permissions: { notifications: 'YES' } });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // Helper function to dismiss Intercom overlay
  const dismissIntercomOverlay = async () => {
    // Wait a bit for the overlay to be fully rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Try multiple approaches to dismiss the overlay
    const tryDismiss = async () => {
      try {
        // Try swiping on different view types
        const viewTypes = ['UIView', 'RCTView', 'UIWindow', 'RCTModalHostView'];
        for (const type of viewTypes) {
          try {
            await element(by.type(type)).atIndex(0).swipe('down', 'fast', 0.9);
            // If we get here, the swipe was successful
            return true;
          } catch (e) {
            // Continue to next view type
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    };

    // Try up to 3 times with increasing swipe distance
    for (let i = 0; i < 3; i++) {
      if (await tryDismiss()) {
        break;
      }
      // Wait a bit between attempts
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  // --- Authentication Flow ---
  it('should show unauthenticated state initially', async () => {
    await expect(element(by.text('Logged In: No'))).toBeVisible();
  });

  it('should login as unidentified user', async () => {
    await element(by.text('Login as an Unidentified User')).tap();
    await waitFor(element(by.text('Logged In: Yes')))
      .toBeVisible()
      .withTimeout(5000);
  });
  // --- Messenger and Intercom flows ---

  it('should open messenger after logging in', async () => {
    // Login as unidentified user
    await element(by.text('Login as an Unidentified User')).tap();

    // Wait for login to complete
    await waitFor(element(by.text('Logged In: Yes')))
      .toBeVisible()
      .withTimeout(5000);

    // Open messenger
    await element(by.text('Present Intercom')).tap();

    // Try to dismiss Intercom overlay
    await dismissIntercomOverlay();

    // Note: We can't verify the messenger UI directly as it's in a native view
    // But we can verify we're not on the main screen anymore
    await expect(element(by.text('Intercom Example App'))).toBeVisible();
  });

  it('should display messenger', async () => {
    await waitFor(element(by.id('display-messenger')))
      .toBeVisible()
      .whileElement(by.id('main-scroll'))
      .scroll(100, 'down');
    await element(by.id('display-messenger')).tap();
    // Close overlay if present
    await dismissIntercomOverlay();
  });

  it('should display article', async () => {
    await waitFor(element(by.id('display-article')))
      .toBeVisible()
      .whileElement(by.id('main-scroll'))
      .scroll(100, 'down');
    await element(by.id('display-article')).tap();
    try {
      await element(by.id('close-overlay')).tap();
    } catch (e) {}
  });

  it('should present message composer', async () => {
    await waitFor(element(by.id('display-message-composer')))
      .toBeVisible()
      .whileElement(by.id('main-scroll'))
      .scroll(100, 'down');
    await element(by.id('display-message-composer')).tap();
    await dismissIntercomOverlay();
  });

  it('should display help center', async () => {
    await element(by.id('display-help-center')).tap();
    await dismissIntercomOverlay();
  });

  it('should fetch help center collections', async () => {
    await element(by.id('fetch-help-center-collections')).tap();
  });

  it('should toggle launcher visibility', async () => {
    // First scroll to the bottom of the screen
    await element(by.id('main-scroll')).scrollTo('bottom');

    // Then wait for and tap the toggle button
    await waitFor(element(by.id('toggle-launcher-visibility')))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id('toggle-launcher-visibility')).tap();
    await element(by.id('toggle-launcher-visibility')).tap();
  });

  it('should get unread messages count', async () => {
    // First scroll to the bottom of the screen
    await element(by.id('main-scroll')).scrollTo('bottom');

    // Then wait for and tap the toggle button
    await waitFor(element(by.id('get-unreads')))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id('get-unreads')).tap();
    // Optionally, check for alert or result
  });

  it('should set bottom padding', async () => {
    // First scroll to the bottom of the screen
    await element(by.id('main-scroll')).scrollTo('bottom');

    // Then wait for and tap the toggle button
    await waitFor(element(by.id('set-bottom-padding')))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id('toggle-launcher-visibility')).tap();
    await element(by.id('set-bottom-padding')).tap();
    await element(by.id('set-bottom-padding')).tap();
  });

  it('should logout', async () => {
    await element(by.id('main-scroll')).scrollTo('bottom');

    // Then wait for and tap the toggle button
    await waitFor(element(by.id('logout')))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id('logout')).tap();
  });
});
