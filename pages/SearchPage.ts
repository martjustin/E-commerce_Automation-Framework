import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  readonly searchResults: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.searchResults = page.locator('.productinfo.text-center p');
    this.productCards = page.locator('.features_items .product-image-wrapper');
  }

  /** Get count of search result items */
  async getResultCount(): Promise<number> {
    await this.searchResults.first().waitFor({ state: 'visible', timeout: 10000 });
    return await this.searchResults.count();
  }

  /** Verify at least one result is displayed */
  async hasResults(): Promise<boolean> {
    return (await this.getResultCount()) > 0;
  }

  /**
   * automationexercise.com no longer renders a "No results found" message
   * for an empty search — it just shows zero product cards under the
   * "Searched Products" heading (verified live). Absence of any product
   * card is the only observable signal of "no results".
   */
  async hasNoResults(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    return (await this.productCards.count()) === 0;
  }
}