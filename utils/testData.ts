// Email is intentionally NOT a static field here. `Date.now()` at module
// load only runs once per test process, so every test importing USER.email
// got the *same* address — the second signup in a run collided with
// "Email Address already exist!" on automationexercise.com. Call
// uniqueEmail() once per test instead.
export function uniqueEmail(prefix = 'testuser'): string {
  return `${prefix}${Date.now()}_${Math.floor(Math.random() * 1_000_000)}@example.com`;
}

export const USER = {
  name: 'Test User',
  password: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe',
  company: 'QA Corp',
  address1: '123 Automation Lane',
  address2: 'Suite 100',
  city: 'Testville',
  state: 'California',
  zipcode: '90001',
  mobile: '1234567890',
};

// Test card for the /payment form — automationexercise.com never actually
// charges a card, any well-formed values are accepted.
export const TEST_CARD = {
  name: 'Test User',
  number: '4242424242424242',
  cvc: '123',
  month: '12',
  year: '2030',
};

export const SEARCH_TERM = 'dress';
export const CATEGORY = 'Women';
export const SUBCATEGORY = 'Dress';