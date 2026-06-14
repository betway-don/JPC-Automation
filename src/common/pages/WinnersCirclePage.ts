import { Page, Locator, expect } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';
import { css, text, first } from '../locators/sel';

export class WinnersCirclePage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('winnersCircle', {
            bigWinnersHeading: first(text("Big Winners")),
            bigWinnersCarousel: first(css("div.scroller-casino")),
            bigWinnersCard: first(css("div.game-card.is-carousel.big-card")),
            bigWinnersGameLink: first(css("div.game-card.is-carousel.big-card a.game-card")),
            bigWinnersGameName: first(css("div.game-card.is-carousel.big-card strong.w-full")),
            bigWinnersAmount: first(css("div.game-card.is-carousel.big-card span.text-sm.font-bold")),
            bigWinnersMaskedUser: first(css("div.game-card.is-carousel.big-card .text-xs.truncate")),
            allWinnersHeading: first(text("All Winners")),
            allWinnersTable: first(css("div.max-h-96.overflow-y-auto table")),
            allWinnersTableContainer: first(css("div.max-h-96.overflow-y-auto")),
            hotGamesHeading: first(text("Hot Games")),
            mostPopularHeading: first(text("Most Popular")),
            mostLikedHeading: first(text("Most Liked")),
            winnersFavBtn: first(css("div.game-card.is-carousel.big-card div[aria-label^=\"favorite-game\"]:has(svg.text-light-50)")),
            winnersFavActiveBtn: first(css("div.game-card.is-carousel.big-card div[aria-label^=\"favorite-game\"]:has(svg.primary-pink-gradient-text)")),
        });
    }

    async navigate() {
        await this.page.locator('button[element-name="page-link-winners"]').click();
        await this.page.waitForURL(/\/winners/, { timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('div.game-card.is-carousel.big-card').first().waitFor({ state: 'visible', timeout: 15000 });
    }

    /** Rows in the All Winners table. */
    get allWinnersRows(): Locator {
        return this.locators.allWinnersTable.locator('tbody tr');
    }
    /** Favourite icons on the Big Winners carousel cards. */
    get bigWinnerFavIcons(): Locator {
        return this.page.locator('div.game-card.is-carousel.big-card div[aria-label^="favorite-game"]');
    }

    getGameSection(title: string) {
        return this.page
            .locator('div.hidden.md\\:flex > div.bg-layer.rounded-xl')
            .filter({ has: this.page.locator('p', { hasText: title }) })
            .first();
    }

    getGameCards(sectionTitle: string) {
        return this.getGameSection(sectionTitle).locator('a[href^="/home/"]');
    }

    async activateGameSection(title: string) {
        await this.getGameSection(title).evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center' }));
        await this.page.waitForTimeout(300);
    }

    getBigWinnersCards() {
        return this.page.locator('div.game-card.is-carousel.big-card');
    }

    async clickBigWinnersGame() {
        await this.safeActions.safeClick('bigWinnersGameLink', this.locators.bigWinnersGameLink);
    }

    async clickFavouriteAdd() {
        await this.safeActions.safeClick('winnersFavBtn', this.locators.winnersFavBtn);
    }

    async clickFavouriteRemove() {
        await this.safeActions.safeClick('winnersFavActiveBtn', this.locators.winnersFavActiveBtn);
    }

    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        } else {
            console.error(`Locator ${key} not found`);
        }
    }

    async highlightLocator(name: string, locator: Locator) {
        await this.safeActions.safeHighlight(name, locator);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API
    // ══════════════════════════════════════════════════════════════════════════
    private static readonly CURRENCY = /(R|GHS|GH₵|₵|MWK|TZS|TSh)\s*[\d,]+/i;

    // ── semantic accessors ──────────────────────────────────────────────────────
    get bigWinnersHeading(): Locator { return this.locators.bigWinnersHeading; }
    get bigWinnersCarousel(): Locator { return this.locators.bigWinnersCarousel; }
    get bigWinnersCard(): Locator { return this.locators.bigWinnersCard; }
    get bigWinnersGameLink(): Locator { return this.locators.bigWinnersGameLink; }
    get allWinnersHeading(): Locator { return this.locators.allWinnersHeading; }
    get allWinnersTable(): Locator { return this.locators.allWinnersTable; }

    // ── actions ──────────────────────────────────────────────────────────────────
    async open(): Promise<void> { await this.navigate(); }
    async launchBigWinnersGame(): Promise<void> { await this.clickBigWinnersGame(); }
    /** Open a game from a named games section; returns the game path it pointed to. */
    async launchSectionGame(sectionTitle: string): Promise<string> {
        await this.activateGameSection(sectionTitle);
        const card = this.getGameCards(sectionTitle).first();
        const href = await card.getAttribute('href');
        await card.click();
        return (href || '').split('?')[0];
    }

    // ── assertions ────────────────────────────────────────────────────────────────
    async expectOnWinnersPage(): Promise<void> {
        await this.expectAt(/\/winners/);
        await expect(this.bigWinnersHeading).toBeVisible();
    }
    async expectPageSections(): Promise<void> {
        await expect(this.bigWinnersHeading).toBeVisible();
        await expect(this.bigWinnersCarousel).toBeVisible();
        await expect(this.allWinnersHeading).toBeVisible();
    }
    /** Big-winner card carries a real amount, a masked account, and a game name. */
    async expectBigWinnerCardValid(): Promise<void> {
        await expect(this.bigWinnersCard).toBeVisible();
        expect((await this.locators.bigWinnersAmount.textContent())?.trim()).toMatch(WinnersCirclePage.CURRENCY);
        expect((await this.locators.bigWinnersMaskedUser.textContent())?.trim()).toMatch(/^\*+\d+$/);
        expect((await this.locators.bigWinnersGameName.textContent())?.trim().length).toBeGreaterThan(0);
    }
    async expectBigWinnersScrolls(): Promise<void> {
        const before = await this.bigWinnersCarousel.evaluate((el: HTMLElement) => el.scrollLeft);
        await this.bigWinnersCarousel.hover();
        await this.page.mouse.wheel(500, 0);
        await expect.poll(() => this.bigWinnersCarousel.evaluate((el: HTMLElement) => el.scrollLeft)).toBeGreaterThan(before);
    }
    async expectAllWinnersSection(): Promise<void> {
        await expect(this.allWinnersHeading).toBeVisible();
        await expect(this.allWinnersTable).toBeVisible();
    }
    async expectAllWinnersHasRows(): Promise<void> {
        await expect(this.allWinnersTable).toBeVisible();
        expect(await this.allWinnersRows.count()).toBeGreaterThan(0);
        await expect(this.allWinnersRows.first()).toContainText(WinnersCirclePage.CURRENCY);
    }
    async expectAllWinnersScrolls(): Promise<void> {
        const c = this.locators.allWinnersTableContainer;
        await c.evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center' }));
        const scrollable = await c.evaluate((el: HTMLElement) => el.scrollHeight > el.clientHeight);
        if (scrollable) {
            await c.evaluate((el: HTMLElement) => { el.scrollTop = 200; });
            expect(await c.evaluate((el: HTMLElement) => el.scrollTop)).toBeGreaterThan(0);
        } else {
            expect(await this.allWinnersRows.count()).toBeGreaterThan(0);
        }
    }
    /** Activate a named games section and confirm it shows game cards. */
    async expectGamesSection(title: string): Promise<void> {
        await this.activateGameSection(title);
        const section = this.getGameSection(title);
        await expect(section).toBeVisible();
        await expect(this.getGameCards(title).first()).toBeVisible();
        expect(await this.getGameCards(title).count()).toBeGreaterThan(0);
    }
    async expectBigWinnersCardCount(): Promise<void> { expect(await this.getBigWinnersCards().count()).toBeGreaterThan(0); }
    async expectFavIconsOnBigWinners(): Promise<void> {
        await expect(this.bigWinnersCard).toBeVisible();
        expect(await this.bigWinnerFavIcons.count()).toBeGreaterThan(0);
    }
}
