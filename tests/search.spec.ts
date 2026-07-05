import { test, expect } from '../fixtures/testFixtures';
import { SEARCH_TERM } from '../utils/testData';

test.describe('Product Search', () => {
  test('TC03 - Search for a product returns relevant results', async ({ homePage, searchPage }) => {
    await homePage.open();
    await homePage.searchProduct(SEARCH_TERM);
    // After search, we are on the search results page
    expect(await searchPage.hasResults()).toBeTruthy();
  });

  test('TC04 - Search with non‑existent term shows no results message', async ({ homePage, searchPage }) => {
    await homePage.open();
    await homePage.searchProduct('xyznonexistent123');
    // The app no longer renders a "No results found" message — it just
    // shows zero product cards (verified live).
    expect(await searchPage.hasNoResults()).toBeTruthy();
  });
});