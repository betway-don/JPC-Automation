import { Page, Locator, expect } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';
import { css, first } from '../locators/sel';

export class SearchPage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('search', {
            searchBtn: first(css('[element-name="nav-bar-search"]')),
            searchModal: first(css('[role="dialog"][aria-modal="true"]')),
            searchModalTitle: first(css('[id="Search games-modal-title"]')),
            searchCloseBtn: first(css('button[element-name="close-modal"]')),
            searchInput: first(css('input#search')),
            searchResultsGrid: first(css('[role="dialog"] div.grid.pb-5.gap-2:visible')),
            searchGameCard: first(css('[role="dialog"] a.game-card[href*="sea=true"]:visible')),
            searchGameTitle: first(css('[role="dialog"] a.game-card[href*="sea=true"]:visible strong.line-clamp-1')),
            searchGameImage: first(css('[role="dialog"] a.game-card[href*="sea=true"]:visible img[alt]')),
            searchNoResults: first(css('div.flex-col.leading-4')),
            searchClearInputBtn: first(css('div.rounded-full.bg-stacked.p-1.cursor-pointer')),
            recentSearchesSection: first(css('div.mt-4.overflow-auto')),
            recentSearchItem: first(css('div.bg-layer-2.rounded-lg')),
            recentSearchClearAll: first(css('div.bg-layer-1.rounded-lg')),
            searchCategoryTabList: first(css('[role="dialog"] div.tabs-header')),
            searchActiveTab: first(css('[role="dialog"] div.tabs-list.bg-primary')),
        });
    }

    /** Text of the first recent-search history entry. */
    get recentSearchItemText(): Locator {
        return this.locators.recentSearchItem.locator('p').first();
    }

    async navigate() {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    }

    async openSearch() {
        await this.safeActions.safeClick('searchBtn', this.locators.searchBtn);
    }

    async typeSearch(query: string) {
        await this.safeActions.safeFill('searchInput', this.locators.searchInput, query);
    }

    async clearSearchByKeyboard() {
        await this.locators.searchInput.click({ clickCount: 3 });
        await this.locators.searchInput.press('Backspace');
    }

    async clearSearchByBtn() {
        await this.safeActions.safeClick('searchClearInputBtn', this.locators.searchClearInputBtn);
    }

    async closeSearch() {
        await this.safeActions.safeClick('searchCloseBtn', this.locators.searchCloseBtn);
    }

    async closeSearchByEsc() {
        await this.page.keyboard.press('Escape');
    }

    async clickFirstResult() {
        await this.page.locator('[role="dialog"] a.game-card[href*="sea=true"]:visible').first().click();
    }

    async clickCategoryTab(name: string) {
        await this.page.locator('[role="dialog"] div.tabs-list').filter({ hasText: name }).click();
    }

    getCategoryTab(name: string) {
        return this.page.locator('[role="dialog"] div.tabs-list').filter({ hasText: name });
    }

    getActiveTab() {
        return this.page.locator('[role="dialog"] div.tabs-list.bg-primary');
    }

    getSearchResults() {
        return this.page.locator('[role="dialog"] a.game-card[href*="sea=true"]:visible');
    }

    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        } else {
            console.error(`Locator ${key} not found`);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API — selectors, waits and DOM probes stay here; specs read as steps.
    // ══════════════════════════════════════════════════════════════════════════
    get searchButton(): Locator { return this.locators.searchBtn; }
    get modal(): Locator { return this.locators.searchModal; }
    get modalTitle(): Locator { return this.locators.searchModalTitle; }
    get input(): Locator { return this.locators.searchInput; }
    get resultsGrid(): Locator { return this.locators.searchResultsGrid; }
    get firstGameCard(): Locator { return this.locators.searchGameCard; }
    get gameImage(): Locator { return this.locators.searchGameImage; }
    get gameTitle(): Locator { return this.locators.searchGameTitle; }
    get noResults(): Locator { return this.locators.searchNoResults; }
    get clearButton(): Locator { return this.locators.searchClearInputBtn; }
    get categoryTabs(): Locator { return this.locators.searchCategoryTabList; }
    get recentSearches(): Locator { return this.locators.recentSearchesSection; }
    get recentSearchEntry(): Locator { return this.locators.recentSearchItem; }

    // ── actions (each leaves the modal/results settled) ─────────────────────────
    async open(): Promise<void> {
        await this.openSearch();
        await this.modal.waitFor({ state: 'visible' });
    }
    /** Type a query and wait until results (or the empty state) have rendered. */
    async search(query: string): Promise<void> {
        await this.typeSearch(query);
        await Promise.race([
            this.resultsGrid.waitFor({ state: 'visible', timeout: 8000 }),
            this.noResults.waitFor({ state: 'visible', timeout: 8000 }),
        ]).catch(() => { });
    }
    async selectCategory(name: string): Promise<void> {
        await this.clickCategoryTab(name);
        await this.resultsGrid.waitFor({ state: 'visible' }).catch(() => { });
    }
    async clearByKeyboard(): Promise<void> { await this.clearSearchByKeyboard(); }
    async clearByButton(): Promise<void> { await this.clearSearchByBtn(); }
    async closeByX(): Promise<void> { await this.closeSearch(); await this.modal.waitFor({ state: 'hidden' }); }
    async closeByEsc(): Promise<void> { await this.closeSearchByEsc(); await this.modal.waitFor({ state: 'hidden' }); }
    async scrollResults(): Promise<void> { await this.modal.evaluate((el: HTMLElement) => el.scrollTo(0, el.scrollHeight)); }
    /** Launch the first result; returns the game path (no query string) it pointed to. */
    async launchFirstResult(): Promise<string> {
        const href = await this.getSearchResults().first().getAttribute('href');
        const path = (href || '').split('?')[0];
        await this.clickFirstResult();
        return path;
    }

    // ── data helpers ────────────────────────────────────────────────────────────
    resultCount(): Promise<number> { return this.getSearchResults().count(); }
    resultLabels(): Promise<string[]> { return this.getSearchResults().evaluateAll((els: Element[]) => els.map(e => e.getAttribute('aria-label') || '')); }
    resultHrefs(): Promise<string[]> { return this.getSearchResults().evaluateAll((els: Element[]) => els.map(e => e.getAttribute('href') || '')); }
    inputValue(): Promise<string> { return this.input.inputValue(); }

    // ── assertions ──────────────────────────────────────────────────────────────
    async expectModalOpen(): Promise<void> {
        await expect(this.modal).toBeVisible();
        await expect(this.modalTitle).toBeVisible();
        await expect(this.input).toBeVisible();
    }
    async expectModalClosed(): Promise<void> { await expect(this.modal).not.toBeVisible(); }
    async expectResults(): Promise<void> { await expect(this.resultsGrid).toBeVisible(); expect(await this.resultCount()).toBeGreaterThan(0); }
    async expectNoResults(): Promise<void> { await expect(this.noResults).toBeVisible(); }
    async expectResultsHidden(): Promise<void> { await expect(this.resultsGrid).not.toBeVisible(); }
    async expectInputEmpty(): Promise<void> { expect(await this.inputValue()).toBe(''); }
    async expectThumbnailLoaded(): Promise<void> { await this.expectImageLoaded(this.gameImage.first()); }
    async expectActiveCategory(name: string): Promise<void> { await expect(this.getCategoryTab(name)).toHaveClass(/bg-primary/); }
    /** Top result matches the query and at least half the set is on-topic (fuzzy-engine tolerance). */
    async expectRelevant(query: RegExp): Promise<void> {
        const labels = await this.resultLabels();
        expect(labels.length).toBeGreaterThan(0);
        expect(labels[0], `top result "${labels[0]}" does not match ${query}`).toMatch(query);
        const matching = labels.filter(l => query.test(l)).length;
        expect(matching, `only ${matching}/${labels.length} match ${query}`).toBeGreaterThanOrEqual(Math.ceil(labels.length / 2));
    }
    /** Every result belongs to the reference set of game slugs (category ⊆ All). */
    async expectResultsSubsetOf(referenceHrefs: string[]): Promise<void> {
        const slug = (href: string) => (href.split('?')[0].split('/').filter(Boolean).pop() || '');
        const ref = new Set(referenceHrefs.map(slug));
        for (const h of await this.resultHrefs()) {
            expect(ref.has(slug(h)), `category result ${h} not present in All results`).toBe(true);
        }
    }
    async expectNoDuplicateResults(): Promise<void> {
        const paths = (await this.resultHrefs()).map(h => h.split('?')[0]).filter(Boolean);
        expect(new Set(paths).size, 'duplicate game tiles in results').toBe(paths.length);
    }
    /** Type a query and assert results render within the time budget. */
    async expectSearchRespondsWithin(query: string, ms: number): Promise<void> {
        const start = Date.now();
        await this.typeSearch(query);
        await this.resultsGrid.waitFor({ state: 'visible' });
        expect(Date.now() - start, 'search response time').toBeLessThan(ms);
    }
    /** Text of the most recent search-history entry. */
    async recentSearchText(): Promise<string> {
        return (await this.recentSearchItemText.textContent())?.trim() || '';
    }
}
