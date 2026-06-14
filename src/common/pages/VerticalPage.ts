import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for a game vertical (Slot Games / Live Games / Crash / Quick / Betgames).
 * Parameterised by the vertical's URL path; owns every vertical-page selector, the
 * navigation/category helpers, AND the assertions so no mechanics appear in the spec.
 */
export class VerticalPage {
    constructor(readonly page: Page, readonly path: string) {}

    /** A regex matching this vertical's path + an optional suffix. */
    pathRegex(suffix = ''): RegExp { return new RegExp(`${this.path.replace('/', '\\/')}${suffix}`); }

    // ─── banner ──────────────────────────────────────────────────────────────
    get bannerCarousel(): Locator { return this.page.locator('section.carousel'); }
    get bannerActiveSlide(): Locator { return this.page.locator('section.carousel li.carousel__slide--active'); }
    get bannerImage(): Locator { return this.page.locator('section.carousel li.carousel__slide--active img'); }
    get bannerNextButton(): Locator { return this.page.locator('div.banner-navigation.next'); }
    get bannerPagination(): Locator { return this.page.locator('ol.carousel__pagination button.carousel__pagination-button'); }

    // ─── categories ──────────────────────────────────────────────────────────
    /** Category chips: anchors whose button carries an id (excludes the header nav tab). */
    get categoryChips(): Locator { return this.page.locator(`a[href^="${this.path}"]:has(button[id])`); }
    get subCategoryChips(): Locator { return this.page.locator(`a[href^="${this.path}/"]:has(button[id])`); }
    categoryChip(href: string): Locator { return this.page.locator(`a[href="${href}"]:has(button[id])`); }
    get categoryBackButton(): Locator { return this.page.locator('button[size="icon-lg"].aspect-square'); }
    get providersChip(): Locator { return this.page.locator(`a[href="${this.path}/providers"]`); }

    // ─── games & providers ─────────────────────────────────────────────────────
    get gameCards(): Locator { return this.page.locator('a.game-card'); }
    get gameScrollers(): Locator { return this.page.locator('div.scroller-casino'); }
    get providerCards(): Locator { return this.page.locator('a.provider-card'); }
    get allGamesLinks(): Locator { return this.page.locator('a:has-text("All Games")'); }
    /** Launched game surface (visible canvas/iframe — ad iframes can precede it in the DOM). */
    get gameFrame(): Locator { return this.page.locator('canvas:visible, iframe[src]:visible').first(); }

    // ─── navigation ──────────────────────────────────────────────────────────
    async goto(): Promise<void> {
        await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
        await this.gameCards.first().waitFor({ state: 'visible', timeout: 20000 });
    }

    async gotoProviders(): Promise<void> {
        await this.page.goto(`${this.path}/providers`, { waitUntil: 'domcontentloaded' });
    }

    /** Category chip hrefs below the vertical root, e.g. /spingames/featured — excluding /providers. */
    async gameCategoryHrefs(): Promise<string[]> {
        const hrefs: string[] = await this.subCategoryChips.evaluateAll(
            (els: Element[]) => [...new Set(els.map(e => e.getAttribute('href') || ''))]);
        return hrefs.filter(h => h && !h.endsWith('/providers'));
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API
    // ══════════════════════════════════════════════════════════════════════════
    async hasBanners(): Promise<boolean> { return (await this.bannerCarousel.count()) > 0; }

    async expectBannerLoaded(): Promise<void> {
        await expect(this.bannerCarousel.first()).toBeVisible();
        await expect(this.bannerActiveSlide.first()).toBeVisible();
        const img = this.bannerImage.first();
        await expect(img).toBeVisible();
        await expect.poll(() => img.evaluate((el: any) => el.naturalWidth)).toBeGreaterThan(0);
    }

    async expectCategoryChips(): Promise<void> {
        await expect(this.categoryChips.first()).toBeVisible();
        expect(await this.categoryChips.count(), 'vertical should offer more than just the All chip').toBeGreaterThan(1);
    }

    /** Every category in the vertical, when opened, shows game tiles. */
    async expectEveryCategoryHasGames(): Promise<void> {
        await expect(this.categoryChips.first()).toBeVisible();
        const hrefs = await this.gameCategoryHrefs();
        expect(hrefs.length).toBeGreaterThan(0);
        for (const href of hrefs) {
            await this.page.goto(href, { waitUntil: 'domcontentloaded' });
            await expect(this.gameCards.first(), `category ${href} shows no games`).toBeVisible({ timeout: 20000 });
        }
    }

    /** Open the first category chip; assert the URL changed and tiles rendered. */
    async openFirstCategory(): Promise<void> {
        const hrefs = await this.gameCategoryHrefs();
        expect(hrefs.length).toBeGreaterThan(0);
        await this.categoryChip(hrefs[0]).first().click();
        await expect(this.page).toHaveURL(new RegExp(hrefs[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        await expect(this.gameCards.first()).toBeVisible({ timeout: 20000 });
    }

    async expectBackButtonVisible(): Promise<void> { await expect(this.categoryBackButton.first()).toBeVisible(); }
    async backToAllCategory(): Promise<void> {
        await this.categoryBackButton.first().click();
        await expect(this.page).toHaveURL(this.pathRegex('/?(\\?.*)?$'));
        await expect(this.gameCards.first()).toBeVisible({ timeout: 20000 });
    }

    /** At least one game section scrolls horizontally (or, if none overflow, tiles still render). */
    async expectTilesScroll(): Promise<void> {
        await expect(this.gameScrollers.first()).toBeVisible();
        const count = await this.gameScrollers.count();
        for (let i = 0; i < count; i++) {
            const section = this.gameScrollers.nth(i);
            const overflows = await section.evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth).catch(() => false);
            if (!overflows) continue;
            await section.scrollIntoViewIfNeeded();
            const before = await section.evaluate((el: HTMLElement) => el.scrollLeft);
            await section.evaluate((el: HTMLElement) => { el.scrollLeft += 300; });
            await expect.poll(() => section.evaluate((el: HTMLElement) => el.scrollLeft)).toBeGreaterThan(before);
            return;
        }
        expect(await this.gameCards.count()).toBeGreaterThan(0);
    }

    /** Multi-banner verticals advance on Next; single-banner verticals just render their one slide. */
    async expectBannersScroll(): Promise<void> {
        await expect(this.bannerCarousel.first()).toBeVisible();
        if (await this.bannerNextButton.count() === 0) {
            expect(await this.bannerPagination.count(), 'no nav, so at most one slide').toBeLessThanOrEqual(1);
            await expect(this.bannerActiveSlide.first()).toBeVisible();
            return;
        }
        const activeIndex = () => this.bannerPagination.evaluateAll(
            (btns: Element[]) => btns.findIndex(b => b.classList.contains('carousel__pagination-button--active')));
        const before = await activeIndex();
        await this.bannerNextButton.first().click();
        await expect.poll(activeIndex).not.toBe(before);
    }

    async openProvidersViaChip(): Promise<void> {
        await expect(this.providersChip.first()).toBeVisible();
        await this.providersChip.first().click();
        await expect(this.page).toHaveURL(this.pathRegex('/providers'));
    }
    async expectProviderListing(): Promise<void> {
        await this.gotoProviders();
        await expect(this.providerCards.first()).toBeVisible({ timeout: 20000 });
    }
    async expectAllProvidersDisplayed(): Promise<void> {
        await this.gotoProviders();
        await expect(this.providerCards.first()).toBeVisible({ timeout: 20000 });
        expect(await this.providerCards.count()).toBeGreaterThan(0);
        await expect.poll(() => this.providerCards.first().locator('img').evaluate((el: any) => el.naturalWidth)).toBeGreaterThan(0);
    }
    async openFirstProviderListing(): Promise<void> {
        await this.gotoProviders();
        const first = this.providerCards.first();
        await expect(first).toBeVisible({ timeout: 20000 });
        const href = ((await first.getAttribute('href')) || '').split('?')[0];
        await first.click();
        await expect(this.page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        await expect(this.gameCards.first()).toBeVisible({ timeout: 20000 });
    }

    /** Launch the first game in a list; returns whether the account was bounced (restricted). */
    private async launchGame(game: Locator): Promise<{ bounced: boolean; href: string }> {
        const href = ((await game.getAttribute('href')) || '').split('?')[0];
        await game.click();
        const bounced = await this.page.waitForURL(/accountRestricted=1/, { timeout: 5000 }).then(() => true).catch(() => false);
        return { bounced, href };
    }
    async launchFirstProviderGame(): Promise<{ bounced: boolean; href: string }> {
        await this.gotoProviders();
        await this.providerCards.first().click();
        await expect(this.gameCards.first()).toBeVisible({ timeout: 20000 });
        return this.launchGame(this.gameCards.first());
    }
    async launchFirstCategoryGame(): Promise<{ bounced: boolean; href: string }> {
        const game = this.gameCards.first();
        await expect(game).toBeVisible({ timeout: 20000 });
        const href = ((await game.getAttribute('href')) || '').split('?')[0];
        expect(href.split('/').filter(Boolean).length).toBeGreaterThanOrEqual(2);
        return this.launchGame(game);
    }
    async expectGameLaunched(href: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        await expect(this.gameFrame).toBeVisible({ timeout: 30000 });
    }

    /** The first "All Games" link stays within the vertical and shows games. */
    async expectAllGamesLink(): Promise<void> {
        const link = this.allGamesLinks.first();
        await link.scrollIntoViewIfNeeded();
        await expect(link).toBeVisible();
        const href = ((await link.getAttribute('href')) || '').split('?')[0];
        expect(href, `All Games link leaves the vertical: "${href}"`).toMatch(this.pathRegex('(/|$)'));
        await link.click();
        await expect(this.page).toHaveURL(this.pathRegex('(/|$|\\?)'));
        await expect(this.gameCards.first()).toBeVisible({ timeout: 20000 });
    }
}
