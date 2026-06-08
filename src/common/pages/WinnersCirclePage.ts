import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

export class WinnersCirclePage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, private safeActions: SafeActions) {
        this.page = page;
        const configs = loadLocatorsFromJson('winnersCircle');

        this.locators = {
            bigWinnersHeading: getLocator(this.page, configs['bigWinnersHeading']),
            bigWinnersCarousel: getLocator(this.page, configs['bigWinnersCarousel']),
            bigWinnersCard: getLocator(this.page, configs['bigWinnersCard']),
            bigWinnersGameLink: getLocator(this.page, configs['bigWinnersGameLink']),
            bigWinnersGameName: getLocator(this.page, configs['bigWinnersGameName']),
            bigWinnersAmount: getLocator(this.page, configs['bigWinnersAmount']),
            bigWinnersMaskedUser: getLocator(this.page, configs['bigWinnersMaskedUser']),
            allWinnersHeading: getLocator(this.page, configs['allWinnersHeading']),
            allWinnersTable: getLocator(this.page, configs['allWinnersTable']),
            allWinnersTableContainer: getLocator(this.page, configs['allWinnersTableContainer']),
            hotGamesHeading: getLocator(this.page, configs['hotGamesHeading']),
            mostPopularHeading: getLocator(this.page, configs['mostPopularHeading']),
            mostLikedHeading: getLocator(this.page, configs['mostLikedHeading']),
            winnersFavBtn: getLocator(this.page, configs['winnersFavBtn']),
            winnersFavActiveBtn: getLocator(this.page, configs['winnersFavActiveBtn']),
        };
    }

    async navigate() {
        await this.page.locator('button[element-name="page-link-winners"]').click();
        await this.page.waitForURL(/\/winners/, { timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('div.game-card.is-carousel.big-card').first().waitFor({ state: 'visible', timeout: 15000 });
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
}
