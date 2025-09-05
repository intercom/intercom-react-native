declare global {
  namespace WebdriverIO {
    interface Browser {
      boot: () => Promise<void>;
      waitForRoot: () => Promise<void>;
      scrollToElementByAccessibilityLabel: (element: string) => Promise<void>;
      wait: (milis: number) => Promise<void>;
      clickWithDelay: (element: string, milis: number) => Promise<void>;
      closeHelpCenterOverlay: () => Promise<void>;
      closeArticleOverlay: () => Promise<void>;
      closeOverlay: (customCloseButtonId?: string) => Promise<void>;
      closeAlert: () => Promise<void>;
    }
  }
}
