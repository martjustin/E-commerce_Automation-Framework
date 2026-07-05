# 🛒 E-Commerce Test Automation Suite

![Playwright](https://img.shields.io/badge/Playwright-1.60-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-20%2B-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

An **end-to-end test automation suite** for [Automation Exercise](https://automationexercise.com), a public e-commerce demo site, built with **Playwright + TypeScript** using the **Page Object Model**. It exercises the flows that decide whether an online store actually makes money — search, cart, checkout, payment, and account access — and attaches **AI-generated root-cause analysis** (via Groq) to every failure automatically.

This isn't a toy suite pointed at a stable sandbox. It's built and hardened against a real, live, third-party site with no test-mode API, no seeded data, and a shared global user database — the same conditions a QA engineer faces when a staging environment isn't available.

---

## 📑 Table of Contents

- [Why These Flows](#why-these-flows)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [AI-Powered Failure Analysis](#ai-powered-failure-analysis)
- [Configuration Notes](#configuration-notes)
- [CI/CD](#cicd)
- [Known Limitations & Roadmap](#known-limitations--roadmap)
- [Design Notes: What Broke and Why](#design-notes-what-broke-and-why)
- [License](#license)

---

## Why These Flows

E-commerce revenue lives or dies on a handful of user journeys. This suite maps directly onto them:

| Business-critical flow | Why it matters | Covered by |
|---|---|---|
| **Browse & search** | If shoppers can't find a product, they can't buy it. Broken search is a silent conversion killer. | TC03, TC04 |
| **Cart management** | Add/update/remove errors cause abandoned carts — the single biggest e-commerce revenue leak. | TC05, TC06, TC07 |
| **Checkout & payment** | Every extra friction point in checkout compounds drop-off. This is the flow with the highest dollar cost per bug. | TC08, TC09 |
| **Account & auth** | Broken signup/login blocks repeat customers and loyalty/rewards flows. | TC10, TC11, TC12 |
| **Homepage availability** | The storefront's front door — if it doesn't render, nothing downstream matters. | TC01, TC02 |

Each test case is written to fail the way a real user would notice it failing (can't find a product, cart total is wrong, order never confirms) rather than asserting on incidental implementation detail.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Playwright](https://playwright.dev) (`^1.40`, installed `1.60`) | Browser automation engine |
| [TypeScript](https://www.typescriptlang.org) | Type-safe page objects, fixtures, and test data |
| [Groq SDK](https://console.groq.com/docs/sdks) | LLM-based root-cause analysis attached to failed tests |
| [dotenv](https://www.npmjs.com/package/dotenv) | Loads `BASE_URL` / `GROQ_API_KEY` from `.env` |
| Playwright Test fixtures | Injects page objects and hooks AI analysis into every test via `test.afterEach` |

---

## Project Structure

```
├── pages/                 # Page Object Model — one class per page/component
│   ├── BasePage.ts         # Shared navigation + retry-aware goto()
│   ├── HomePage.ts
│   ├── SearchPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts     # Address step + /payment card-form step
│   ├── LoginPage.ts
│   └── SignupPage.ts
├── tests/                 # One spec file per business flow
│   ├── homepage.spec.ts    # TC01–TC02
│   ├── search.spec.ts      # TC03–TC04
│   ├── cart.spec.ts        # TC05–TC07
│   ├── checkout.spec.ts    # TC08–TC09
│   └── user-auth.spec.ts   # TC10–TC12
├── fixtures/testFixtures.ts # Custom `test` — injects page objects, attaches AI analysis on failure
├── utils/
│   ├── testData.ts          # uniqueEmail(), USER, TEST_CARD, SEARCH_TERM
│   └── aiFailureAnalysis.ts # Groq client used by the afterEach hook
├── playwright.config.ts
└── .env                    # BASE_URL, GROQ_API_KEY (not committed)
```

---

## Setup

```bash
npm install
npx playwright install chromium   # only chromium is enabled by default — see below
```

Create a `.env` in the project root:

```
BASE_URL=https://automationexercise.com
GROQ_API_KEY=your_key_here   # optional — omit to skip AI failure analysis
```

If `GROQ_API_KEY` is missing, tests still run; failure attachments simply won't include an AI analysis.

---

## Running Tests

```bash
npm test                 # full suite, list reporter
npm run test:headed      # watch the browser
npm run test:ci          # HTML reporter (for CI artifact upload)

npx playwright test tests/checkout.spec.ts     # single flow
npx playwright test -g "TC08"                  # single test case
npx playwright show-report                     # open the last HTML report
```

The suite runs against the **live public site** — expect each full run to take several minutes. `workers: 1` and `retries: 1` are deliberate (see [Configuration Notes](#configuration-notes)), not an oversight.

---

## Test Coverage

| ID | Test | Flow |
|---|---|---|
| TC01 | Homepage loads and displays featured products | Storefront availability |
| TC02 | Navigate to Signup/Login from homepage | Navigation |
| TC03 | Search returns relevant results | Search |
| TC04 | Search with a non-existent term shows zero results | Search (negative case) |
| TC05 | Add product to cart from homepage | Cart |
| TC06 | Set quantity on product detail page, verify it in cart | Cart |
| TC07 | Remove item from cart | Cart |
| TC08 | Guest→registered checkout: cart → address → payment → order confirmation | Checkout + Payment |
| TC09 | Registered user login and checkout | Checkout *(stub — see [Known Limitations](#known-limitations--roadmap))* |
| TC10 | Register a new user | Auth |
| TC11 | Login with valid credentials | Auth |
| TC12 | Login with invalid credentials | Auth (negative case) |

---

## AI-Powered Failure Analysis

`fixtures/testFixtures.ts` registers a global `test.afterEach`: on any failed test, it sends the error message, the failure screenshot, and the page URL to Groq and attaches the resulting root-cause analysis directly to the Playwright HTML report — so a failure report is diagnosable without re-running the test locally.

---

## Configuration Notes

`playwright.config.ts` makes a few choices that look conservative on purpose:

- **`workers: 1`, `fullyParallel: false`** — this suite hits a shared public demo site, not an isolated test environment. Parallel workers would hammer the same server every other QA learner in the world is also using.
- **`retries: 1`** — absorbs genuine third-party flakiness (ad-network calls, Cloudflare checks) without masking real regressions; a test that fails twice in a row is treated as a real failure.
- **Only the `chromium` project is active.** Firefox, WebKit, and mobile Chrome projects exist in the config but are commented out with a `REMOVE ... for now` note — they were disabled because the target site wasn't stable enough cross-browser at the time. Re-enabling them is a config-only change once verified.

---

## CI/CD

`.github/workflows/playwright.yml` runs on push/PR to `main`/`master` across a `[chromium, firefox, webkit]` matrix.

**Known gap:** the workflow's matrix currently references `firefox` and `webkit`, but `playwright.config.ts` only defines the `chromium` project — `npx playwright test --project=firefox` will fail to find a matching project until those projects are re-enabled in the config (see above). Treat the CI browser matrix as aspirational until that's resolved.

---

## Known Limitations & Roadmap

- **TC09 is a stub.** The test body is currently empty (no navigation, no assertions), so it passes trivially rather than verifying anything. It's listed here rather than silently claimed as coverage — implementing it (login as an existing user, then repeat the TC08 checkout flow) is the top open item.
- **Firefox/WebKit/mobile are wired into fixtures and CI but disabled in `playwright.config.ts`** — re-enable once cross-browser stability against the live site is confirmed.
- **No test-mode API or seeded data.** Every run creates real accounts against a real, shared database. Test data generation (`uniqueEmail()`) is designed around that constraint — see below.
- **`npm run lint` has no ESLint config file yet** despite `eslint`/`typescript-eslint` being installed — add `.eslintrc`/`eslint.config.js` before relying on it in CI.

---

## Design Notes: What Broke and Why

This suite was debugged against the live site, not written and left alone. A few non-obvious findings worth keeping in mind if you extend it:

- **Cart quantity isn't editable in the cart.** The cart row renders quantity as a disabled `<button>`, not an input. Quantity has to be set via `#quantity` on the product detail page *before* adding to cart ([`CartPage.ts`](pages/CartPage.ts), [`cart.spec.ts`](tests/cart.spec.ts)).
- **"Place Order" doesn't place the order.** It only navigates to the `/payment` card-details form; the order is confirmed only after that form is submitted ([`CheckoutPage.ts`](pages/CheckoutPage.ts)).
- **Zero-result search shows nothing, not a message.** The app used to render "No results found" text; it now just shows zero product cards. Assertions check for absence of product cards, not removed copy ([`SearchPage.ts`](pages/SearchPage.ts)).
- **Hardcoded "invalid" login credentials aren't safe on a public site.** `wrong@example.com` / `wrongpass` — the exact values every QA tutorial uses — got registered by an unrelated visitor mid-development, silently turning a negative test into a real login. Negative-path tests generate a fresh, high-entropy random email instead of relying on a well-known literal ([`testData.ts`](utils/testData.ts) `uniqueEmail()`, [`user-auth.spec.ts`](tests/user-auth.spec.ts) TC12).
- **Static test data caused cross-test collisions.** An email computed once via `Date.now()` at module import time was reused by every test in the process, so the second signup in a run always hit "Email Address already exist!". `uniqueEmail()` is now called fresh inside each test.

---

## License

MIT
