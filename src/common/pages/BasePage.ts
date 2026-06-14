import { Page, Locator, expect } from '@playwright/test';
import { LocatorMap } from '../locators/sel';
import { overridesForPage } from '../locators/regionOverrides';
import { SafeActions } from '../actions/SafeActions';

/**
 * BasePage — foundation for every Page Object.
 *
 * Architecture contract (enterprise POM):
 *  - Every selector lives in exactly ONE place: a Page Object's `loc` map (or a Component's),
 *    declared with the `sel` builders (css/role/text/…). Raw selector strings must never appear
 *    in *.shared.ts test files, and a Page Object never calls `page.locator(...)` outside its map.
 *  - A region that differs supplies a partial override map in regions/<R>/locators.ts; BasePage
 *    merges it automatically (see {@link build}). One selector change = one place.
 *  - Tests interact with the app exclusively through Page Object getters / actions / assertions.
 *    A guard test (architecture.guard.spec) enforces the no-raw-selectors rule.
 *  - Shared, cross-page UI (login modal, share modal, …) is modelled as Component Objects
 *    (see src/common/components) and reused by Page Objects.
 *
 * Subclasses build their resolved locator map with `this.locators = this.build('<group>', { … })`.
 */
export abstract class BasePage {
    constructor(
        readonly page: Page,
        protected readonly safeActions: SafeActions,
    ) {}

    /**
     * Resolve a Page Object's selector map into live Locators, applying the active region's
     * overrides for this group (region key wins over the base definition).
     */
    protected build(group: string, defs: LocatorMap): Record<string, Locator> {
        const merged: LocatorMap = { ...defs, ...overridesForPage(group) };
        const out: Record<string, Locator> = {};
        for (const key of Object.keys(merged)) out[key] = merged[key](this.page);
        return out;
    }

    // ─── shared navigation / state ────────────────────────────────────────────

    async goto(path = '/'): Promise<void> {
        await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    }

    /** True when the document's theme is dark (Tailwind class-based dark mode). */
    isDarkTheme(): Promise<boolean> {
        return this.page.evaluate(() => document.documentElement.classList.contains('dark'));
    }

    /** Assert the browser navigated to a URL matching the pattern (hides `page` from specs). */
    async expectAt(urlPattern: RegExp | string): Promise<void> {
        await expect(this.page).toHaveURL(urlPattern);
    }

    /** Assert navigation to a content page: right URL AND a heading actually rendered. */
    async expectOnContentPage(urlPattern: RegExp | string): Promise<void> {
        await expect(this.page).toHaveURL(urlPattern);
        await expect(this.pageHeading).toBeVisible();
    }

    async scrollToPageBottom(): Promise<number> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        return this.page.evaluate(() => window.scrollY);
    }

    /** Reload the current page and wait for the DOM. */
    async refresh(): Promise<void> {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
    }

    // ─── cross-page elements (shared by many suites; defined once here) ─────────
    /** Logged-out "Play now" CTA on game pages. */
    get playNowButton(): Locator {
        return this.page.getByRole('button', { name: 'Play now' });
    }
    /** Launched game surface (HTML5 canvas or provider iframe). */
    get gameFrame(): Locator {
        return this.page.locator('canvas, iframe[src]').first();
    }
    /** First page heading — used to confirm a content page actually rendered. */
    get pageHeading(): Locator {
        return this.page.locator('h1, h2').first();
    }
    /** Login modal dialog + its mobile field. */
    get loginModal(): Locator {
        return this.page.locator("[role='dialog'][aria-labelledby='Login-modal-title']");
    }
    get loginUsernameInput(): Locator {
        return this.page.locator("input[name='username'][type='tel']");
    }
    /** Sign Up modal dialog. */
    get signUpModalDialog(): Locator {
        return this.page.locator("[role='dialog'][aria-labelledby='Sign Up-modal-title']");
    }
    /** Header "Login" button (visible only when logged out). */
    get headerLoginButton(): Locator {
        return this.page.getByRole('button', { name: 'Login' }).first();
    }
    /** Active homepage banner image. */
    get bannerImage(): Locator {
        return this.page.locator('section.carousel li.carousel__slide--active img').first();
    }
    /** First game card in the featured/trending carousel. */
    get featuredGameCard(): Locator {
        return this.page.locator('#featured-carousel a.game-card').first();
    }
    /** First favourite toggle in the featured/trending carousel. */
    get trendingFavouriteButton(): Locator {
        return this.page.locator('#featured-carousel div[aria-label^="favorite-game"]').first();
    }
    /** "Login" CTA inside the in-game hamburger menu. */
    get hamburgerLoginButton(): Locator {
        return this.page.locator("button[element-name='hamburger-menu-login']");
    }
    /** "Login" link shown inside the Sign Up modal. */
    get signUpLoginLink(): Locator {
        return this.signUpModalDialog.getByText('Login', { exact: true });
    }
    /** First visible generic dialog (used to confirm "something opened"). */
    get anyDialog(): Locator {
        return this.page.locator('[role="dialog"]').first();
    }

    // ─── shared assertions (reused by many suites) ─────────────────────────────

    /** Assert an image element has actually loaded pixels, not just a (possibly broken) src. */
    async expectImageLoaded(image: Locator, timeout = 10000): Promise<void> {
        await expect(image).toBeVisible({ timeout });
        await expect
            .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth), { timeout })
            .toBeGreaterThan(0);
    }

    /** Assert a horizontally-scrollable strip actually scrolls right. */
    async expectScrollsRight(strip: Locator, by = 300, timeout = 5000): Promise<void> {
        await strip.scrollIntoViewIfNeeded();
        const before = await strip.evaluate((el: HTMLElement) => el.scrollLeft);
        await strip.evaluate((el: HTMLElement, px: number) => { el.scrollLeft += px; }, by);
        await expect
            .poll(() => strip.evaluate((el: HTMLElement) => el.scrollLeft), { timeout })
            .toBeGreaterThan(before);
    }

    /** Highlight an element for screenshot evidence (self-healing, never throws). */
    async highlight(key: string, locator: Locator): Promise<void> {
        await this.safeActions.safeHighlight(key, locator);
    }
}
