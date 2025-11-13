import { Page, Locator } from '@playwright/test';

/**
 * MOCK Locator Resolver.
 * This translates the Excel data into Playwright locators.
 * This is a simplified version.
 */
export function getLocator(page: Page, config: { type: string, value: string, options?: string, nth?: number }): Locator {
    const options = config.options ? JSON.parse(config.options.replace(/'/g, '"')) : {};
    const nth = config.nth || 0;

    // Handle regex in options
    if (options.name && options.name.startsWith('/')) {
        options.name = new RegExp(options.name.slice(1, -2), options.name.slice(-1));
    }
    
    let locator: Locator;

    switch (config.type) {
        case 'role':
            locator = page.getByRole(config.value as any, options);
            break;
        case 'text':
            locator = page.getByText(config.value, options);
            break;
        case 'label':
            locator = page.getByLabel(config.value, options);
            break;
        case 'title':
            locator = page.getByTitle(config.value, options);
            break;
        case 'locator':
            locator = page.locator(config.value);
            break;
        default:
            locator = page.locator(config.value);
    }

    if (nth > 0) {
        return locator.nth(nth);
    }
    return locator.first(); // Default to first to avoid ambiguity
}