const scrollToElementByAccessibilityLabel = async (element: string) => {
  if (browser.isAndroid) {
    const bottomElementSelector = `new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("${element}"))`;
    await $(`android=${bottomElementSelector}`);
  } else {
    await browser.execute('mobile: scroll', {
      direction: 'down',
      name: `~${element}`,
    });
  }
};

browser.addCommand(
  'scrollToElementByAccessibilityLabel',
  scrollToElementByAccessibilityLabel
);

const wait = async (milis: number) =>
  new Promise<void>((resolve) => setTimeout(resolve(), milis));
browser.addCommand('wait', wait);

const clickWithDelay = async (element: string, milis: number) => {
  await wait(milis);
  await (await $(element)).click();
};
browser.addCommand('clickWithDelay', clickWithDelay);

const waitForRoot = async () => {
  (await $('~app-root')).waitForDisplayed({ timeout: 12000 });
};
driver.addCommand('waitForRoot', waitForRoot);

const boot = async () => {
  if (browser.isIOS) {
    await (await $('~Allow')).waitForDisplayed({ timeout: 12000 });
    await (await $('~Allow')).click();
  }
};
driver.addCommand('boot', boot);

const closeOverlay = async (customCloseButtonId?: string) => {
  const buttonId = browser.isAndroid
    ? `~Close`
    : customCloseButtonId || `~intercom close button`;

  const closeButton = await $(buttonId);
  await closeButton.waitForDisplayed({ timeout: 22000 });
  await closeButton.click();
};

const closeModalOverlay = async (customCloseButtonId?: string) => {
  const buttonId = browser.isAndroid
    ? `~Close`
    : customCloseButtonId || `~intercom modal close button`;

  const closeButton = await $(buttonId);
  await closeButton.waitForDisplayed({ timeout: 22000 });
  await closeButton.click();
};

browser.addCommand('closeOverlay', closeOverlay);
browser.addCommand('closeModalOverlay', closeModalOverlay);

const closeArticleOverlay = async () => {
  if (browser.isAndroid) {
    const closeButton = await $(
      `/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageButton`
    );
    await closeButton.waitForDisplayed({ timeout: 22000 });
    await closeButton.click();
  } else {
    await closeModalOverlay();
  }
};
browser.addCommand('closeArticleOverlay', closeArticleOverlay);

const closeHelpCenterOverlay = async () => {
  if (browser.isAndroid) {
    const closeButton = await $(
      `/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageButton`
    );
    await closeButton.waitForDisplayed({ timeout: 22000 });
    await closeButton.click();
  } else {
    await closeOverlay('~help center close button');
  }
};
browser.addCommand('closeHelpCenterOverlay', closeHelpCenterOverlay);

const closeAlert = async () => {
  const elementId = browser.isAndroid
    ? '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button\n'
    : '~OK';
  const alertButton = await $(elementId);
  await alertButton.waitForDisplayed({ timeout: 12000 });
  await alertButton.click();
};
browser.addCommand('closeAlert', closeAlert);
