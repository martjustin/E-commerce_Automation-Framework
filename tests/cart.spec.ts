import { test, expect } from '../fixtures/testFixtures';

test.describe('Shopping Cart', () => {
  test('TC05 - Add product to cart from homepage', async ({ homePage, page }) => {
    await homePage.open();
    // Hover over first product and click "Add to cart"
    const firstProduct = page.locator('.product-image-wrapper').first();
    await firstProduct.hover();
    const addToCartBtn = firstProduct.locator('.add-to-cart').first();
    await addToCartBtn.click();
    // Wait for modal and continue shopping
    await page.getByText('Continue Shopping').click();
    // Go to cart and verify item count = 1
    await homePage.goToCart();
    const cartItems = page.locator('tbody tr');
    await expect(cartItems).toHaveCount(1);
  });

  test('TC06 - Update cart quantity and verify total', async ({ cartPage, page }) => {
    // automationexercise.com renders cart-row quantity as a disabled
    // <button>, not an editable input — quantity must be chosen on the
    // product detail page's #quantity field *before* adding to cart.
    await page.goto('/product_details/1');
    await page.locator('#quantity').fill('3');
    await page.locator('button.cart').click();
    await page.getByText('View Cart').click();
    await page.waitForSelector('tbody tr', { state: 'visible' });
    const qty = await cartPage.getQuantity(0);
    expect(qty).toBe('3');
  });

  test('TC07 - Remove item from cart', async ({ homePage, cartPage, page }) => {
    // Add item and go to cart
    await homePage.open();
    const product = page.locator('.product-image-wrapper').first();
    await product.hover();
    await product.locator('.add-to-cart').first().click();
    await page.getByText('View Cart').click();
    // Remove the first item
    await cartPage.removeItem(0);
    // Verify cart is empty
    await expect(page.locator('#empty_cart')).toBeVisible();
  });
});