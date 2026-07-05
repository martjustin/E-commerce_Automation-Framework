import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Locators
  readonly featuredItems: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly signupLoginLink: Locator;
  readonly cartLink: Locator;
  readonly categoryMenu: Locator;
  readonly productsLink: Locator;

  constructor(page: Page) {
    super(page);
    // Use data‑qa or visible text for robust selectors
    this.featuredItems = page.locator('.features_items .product-image-wrapper');
    // NOTE: this input only exists on the /products page — the homepage has
    // no search box. searchProduct() below navigates there first.
    this.searchInput = page.getByPlaceholder('Search Product');
    this.searchButton = page.locator('#submit_search');
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.categoryMenu = page.locator('.left-sidebar');
    this.productsLink = page.getByRole('link', { name: 'Products' });
  }

  /** Navigate to home page */
  async open() {
    await this.goto('/');
    await this.page.waitForTimeout(1000);
  // Optional: wait for the page to have a stable title or a core element
    await this.page.waitForLoadState('domcontentloaded');
}

  /** Search for a product by typing and clicking search */
  async searchProduct(term: string) {
    // The search box lives on the Products page, not the homepage.
    await this.clickWhenReady(this.productsLink);
    await this.fillField(this.searchInput, term);
    await this.clickWhenReady(this.searchButton);
  }

  /** Navigate to signup/login page */
  async goToSignupLogin() {
    await this.clickWhenReady(this.signupLoginLink);
  }

  /** Open cart page */
  async goToCart() {
    await this.clickWhenReady(this.cartLink);
  }

  /** Verify the homepage is loaded by checking a visible element */
  async isLoaded(): Promise<boolean> {
    return await this.featuredItems.first().isVisible();
  }
}