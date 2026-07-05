# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-auth.spec.ts >> User Authentication >> TC12 - Login with invalid credentials shows error
- Location: tests\user-auth.spec.ts:35:7

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Signup / Login' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - heading "This website is under heavy load (queue full)" [level=2] [ref=e2]
  - paragraph [ref=e3]: We're sorry, too many people are accessing this website at the same time. We're working on this problem. Please try again later.
```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class BasePage {
  4  |   protected page: Page;
  5  | 
  6  |   constructor(page: Page) {
  7  |     this.page = page;
  8  |   }
  9  | 
  10 |   async goto(path: string = '/') {
  11 |     const base = process.env.BASE_URL || 'https://automationexercise.com';
  12 |     const url = path.startsWith('http') ? path : base + path;
  13 | 
  14 |     // Try up to 3 times to navigate, with 'domcontentloaded' (faster than 'load')
  15 |     for (let attempt = 1; attempt <= 3; attempt++) {
  16 |       try {
  17 |         await this.page.goto(url, { timeout: 30_000, waitUntil: 'domcontentloaded' });
  18 |         return; // success
  19 |       } catch (error) {
  20 |         if (attempt === 3) throw error;
  21 |         console.log(`Navigation attempt ${attempt} failed, retrying...`);
  22 |         await this.page.waitForTimeout(2000); // brief pause before retry
  23 |       }
  24 |     }
  25 |   }
  26 | 
  27 |   async getTitle(): Promise<string> {
  28 |     return await this.page.title();
  29 |   }
  30 | 
  31 |   protected async clickWhenReady(locator: Locator) {
  32 |     // Playwright's click already waits for actionability; no extra waitFor needed
> 33 |     await locator.click();
     |                   ^ Error: locator.click: Test timeout of 180000ms exceeded.
  34 |   }
  35 | 
  36 |   protected async fillField(locator: Locator, text: string) {
  37 |     // fill also auto-waits for visibility
  38 |     await locator.fill(text);
  39 |   }
  40 | }
```