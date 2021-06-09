describe('Intercom E2E', () => {
  afterEach(async () => {
    await driver.waitForRoot();
  });

  it('Should login unidentified', async () => {
    await driver.boot();
    await driver.waitForRoot();

    await (await $('~user-email')).setValue('rn-example@intercom.com');
    await (await $('~login-identified')).click();
    driver.isIOS && (await (await $('~login-identified')).click());
    await (await $('~authenticated')).waitForDisplayed({ timeout: 5000 });
  });

  it('Should display messenger', async () => {
    await (await $('~display-messenger')).click();
    await driver.closeOverlay();
  });

  it('Should display article', async () => {
    await (await $('~display-article')).click();
    await driver.closeOverlay();
  });

  it('Should message composer', async () => {
    await driver.scrollToElementByAccessibilityLabel(
      'display-message-composer'
    );
    await (await $('~display-message-composer')).click();
    await driver.closeOverlay();
  });

  it('Should display help center', async () => {
    await driver.scrollToElementByAccessibilityLabel('display-help-center');
    await (await $('~display-help-center')).click();
    await driver.closeHelpCenterOverlay();
  });

  it('Should display carousel', async () => {
    await driver.scrollToElementByAccessibilityLabel('display-carousel');
    await (await $('~display-carousel')).click();
    await driver.closeOverlay();
  });

  it('Should get unread messages count', async () => {
    await driver.scrollToElementByAccessibilityLabel('get-unreads');
    await (await $('~get-unreads')).click();
    await driver.closeAlert();
  });

  it('Should toggle message visibility', async () => {
    await driver.scrollToElementByAccessibilityLabel(
      'toggle-message-visibility'
    );
    await driver.clickWithDelay('~toggle-message-visibility', 2000);
    await driver.clickWithDelay('~toggle-message-visibility', 2000);
  });

  it('Should toggle launcher visibility', async () => {
    await driver.scrollToElementByAccessibilityLabel(
      'toggle-launcher-visibility'
    );
    await driver.clickWithDelay('~toggle-launcher-visibility', 2000);

    const laincherId = driver.isAndroid
      ? '~Intercom launcher'
      : '~intercom launcher';
    await (await $(laincherId)).waitForDisplayed({ timeout: 2000 });
    await driver.clickWithDelay('~toggle-launcher-visibility', 5000);
  });

  it('Should set bottom padding', async () => {
    await driver.scrollToElementByAccessibilityLabel('set-bottom-padding');
    await driver.clickWithDelay('~set-bottom-padding', 400);
    await driver.clickWithDelay('~set-bottom-padding', 400);
    await driver.clickWithDelay('~set-bottom-padding', 400);
    await driver.clickWithDelay('~set-bottom-padding', 400);
  });

  it('Should set log event', async () => {
    await driver.scrollToElementByAccessibilityLabel('log-event');
    await (await $('~log-event')).click();
  });

  it('Should send device token', async () => {
    await driver.scrollToElementByAccessibilityLabel('send-token');
    await (await $('~send-token')).click();
  });

  it("Should update user's name", async () => {
    await driver.scrollToElementByAccessibilityLabel('update-user');
    await (await $('~update-user')).click();
  });

  it('Should set logout ', async () => {
    await driver.scrollToElementByAccessibilityLabel('logout');
    await (await $('~logout')).click();
    await (await $('~unauthenticated')).waitForDisplayed({ timeout: 5000 });
  });

  it('Should login unidentified', async () => {
    await driver.scrollToElementByAccessibilityLabel('login-unidentified');
    await (await $('~login-unidentified')).click();
    await (await $('~authenticated')).waitForDisplayed({ timeout: 5000 });
  });

  it('Should set logout ', async () => {
    await driver.scrollToElementByAccessibilityLabel('logout');
    await (await $('~logout')).click();
    await (await $('~unauthenticated')).waitForDisplayed({ timeout: 5000 });
  });
});
