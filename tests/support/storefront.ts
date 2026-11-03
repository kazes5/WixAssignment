import { Page, Locator } from '@playwright/test';

// Small page helper for the storefront results page (https://www.wix.com/domain/result/?q=...).
// Locators use the page's data-hook attributes and visible text, never generated CSS classes.
// Hooks were confirmed in a logged-out headless browser on 2026-11-03 (see ARCHITECTURE.md §5).

export class StorefrontResults {
  constructor(private readonly page: Page) {}

  // Go straight to the results page, like a shared link. encodeURIComponent keeps "!" and spaces intact.
  async open(query: string): Promise<void> {
    await this.page.goto(`/domain/result/?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });
  }

  // "Exact Match" card: shown only when the searched name itself is available.
  get exactMatchCard(): Locator {
    return this.page.locator('[data-hook="hero-card"]');
  }

  // First alternative card ("Best Match" / "Great Alternative"), shown when there is no exact match.
  get firstAlternativeCard(): Locator {
    return this.page.locator('[data-hook="main-card-0"]');
  }

  // The rows of the "alternatives" list. The ^= / $= pair matches item-0, item-1, ... but not the buttons.
  get alternativeRows(): Locator {
    return this.page.locator('[data-hook^="recommendations-content-list-item-"]:not([data-hook$="-button"])');
  }

  // The status line at the top of the results ("... is already registered", "... aren't available").
  message(text: string | RegExp): Locator {
    return this.page.getByText(text).first();
  }
}

// Matches a price like "₪21.47/yr", "$12.99/yr" or "21,47 ₪/yr" without caring about currency or amount
// (prices depend on location: Domain basics).
export const PRICE_RE = /\d+[.,]\d{2}.{0,3}\/yr/;
