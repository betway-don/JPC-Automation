import { Page, Locator, expect } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

/**
 * BasePage — foundation for every Page Object.
 *
 * Architecture contract (enterprise POM):
 *  - Selectors live ONLY in the locator store (locators.json) or inside Page Objects.
 *    They must never appear in *.shared.ts test files.
 *  - Tests interact with the app exclusively through Page Object getters / actions /
 *    assertions. A guard test (architecture.guard.spec) enforces this.
 *  - Shared, cross-page UI (login modal, share modal, account-options dialog, …) is
 *    modelled as Component Objects (see src/common/components) and reused by Page Objects.
 *
 * Subclasses call `this.bind('<locatorGroup>')` to load their locator group from the store.
 */
export abstract class BasePage {
    constructor(
        readonly page: Page,
        protected readonly safeActions: SafeActions,
    ) {}

    /** Load a locator group from the central store into a typed map. */
    protected bind(group: string): Record<string, Locator> {
        const cfg = loadLocatorsFromJson(group);
        const out: Record<string, Locator> = {};
        for (const key of Object.keys(cfg)) out[key] = getLocator(this.page, cfg[key]);
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

    async scrollToPageBottom(): Promise<number> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        return this.page.evaluate(() => window.scrollY);
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
