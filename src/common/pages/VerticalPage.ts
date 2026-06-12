import { Page, Locator } from '@playwright/test';

/**
 * Page Object for a game vertical (Slot Games / Live Games / Crash / Quick / Betgames).
 * Parameterised by the vertical's URL path; owns every vertical-page selector and the
 * shared navigation/category helpers so no selector appears in the spec.
 */
export class VerticalPage {
    constructor(private readonly page: Page, readonly path: string) {}

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
}
