import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly placeOrderButton: Locator;
  readonly addressDetails: Locator;
  readonly commentField: Locator;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;
  readonly orderPlacedMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    this.addressDetails = page.locator('#address_delivery');
    this.commentField = page.locator('textarea[name="message"]');
    // "Place Order" only navigates to the /payment card-details form — it
    // does not place the order by itself. These fields belong to that form.
    this.nameOnCardInput = page.locator('input[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('input[data-qa="card-number"]');
    this.cvcInput = page.locator('input[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('input[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('input[data-qa="expiry-year"]');
    this.payButton = page.locator('button[data-qa="pay-button"]');
    this.orderPlacedMessage = page.locator('[data-qa="order-placed"]');
  }

  async enterComment(comment: string) {
    await this.fillField(this.commentField, comment);
  }

  async placeOrder() {
    await this.clickWhenReady(this.placeOrderButton);
  }

  async isAddressDisplayed(): Promise<boolean> {
    return await this.addressDetails.isVisible();
  }

  /** Fills the /payment card form and submits it — this is what actually places the order. */
  async confirmPayment(card: { name: string; number: string; cvc: string; month: string; year: string }) {
    await this.fillField(this.nameOnCardInput, card.name);
    await this.fillField(this.cardNumberInput, card.number);
    await this.fillField(this.cvcInput, card.cvc);
    await this.fillField(this.expiryMonthInput, card.month);
    await this.fillField(this.expiryYearInput, card.year);
    await this.clickWhenReady(this.payButton);
  }
}