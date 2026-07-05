import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly quantityButton: (index: number) => Locator;
  readonly removeButton: (index: number) => Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('tbody tr');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.continueShoppingButton = page.getByText('Continue Shopping');
    // Dynamic locators using index
    this.quantityButton = (index: number) => page.locator(`tbody tr:nth-child(${index + 1}) .cart_quantity button`);
    this.removeButton = (index: number) => page.locator(`tbody tr:nth-child(${index + 1}) .cart_quantity_delete`);
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * The cart row renders quantity as `<button class="disabled">N</button>`,
   * not an editable input — automationexercise.com only lets you choose
   * quantity via the #quantity field on the product detail page, before
   * adding to cart. There is no in-cart quantity edit to automate.
   */
  async getQuantity(index: number): Promise<string> {
    return ((await this.quantityButton(index).textContent()) ?? '').trim();
  }

  async removeItem(index: number) {
    await this.removeButton(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  async proceedToCheckout() {
    await this.clickWhenReady(this.proceedToCheckoutButton);
  }
}