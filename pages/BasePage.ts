import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    const base = process.env.BASE_URL || 'https://automationexercise.com';
    const url = path.startsWith('http') ? path : base + path;

    // Try up to 3 times to navigate, with 'domcontentloaded' (faster than 'load')
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.page.goto(url, { timeout: 30_000, waitUntil: 'domcontentloaded' });
        return; // success
      } catch (error) {
        if (attempt === 3) throw error;
        console.log(`Navigation attempt ${attempt} failed, retrying...`);
        await this.page.waitForTimeout(2000); // brief pause before retry
      }
    }
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  protected async clickWhenReady(locator: Locator) {
    // Playwright's click already waits for actionability; no extra waitFor needed
    await locator.click();
  }

  protected async fillField(locator: Locator, text: string) {
    // fill also auto-waits for visibility
    await locator.fill(text);
  }
}