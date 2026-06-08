import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

export class SearchPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, private safeActions: SafeActions) {
        this.page = page;
        const configs = loadLocatorsFromJson('search');

        this.locators = {
            searchBtn: getLocator(this.page, configs['searchBtn']),
            searchModal: getLocator(this.page, configs['searchModal']),
            searchModalTitle: getLocator(this.page, configs['searchModalTitle']),
            searchCloseBtn: getLocator(this.page, configs['searchCloseBtn']),
            searchInput: getLocator(this.page, configs['searchInput']),
            searchResultsGrid: getLocator(this.page, configs['searchResultsGrid']),
            searchGameCard: getLocator(this.page, configs['searchGameCard']),
            searchGameTitle: getLocator(this.page, configs['searchGameTitle']),
            searchGameImage: getLocator(this.page, configs['searchGameImage']),
            searchNoResults: getLocator(this.page, configs['searchNoResults']),
            searchClearInputBtn: getLocator(this.page, configs['searchClearInputBtn']),
            recentSearchesSection: getLocator(this.page, configs['recentSearchesSection']),
            recentSearchItem: getLocator(this.page, configs['recentSearchItem']),
            recentSearchClearAll: getLocator(this.page, configs['recentSearchClearAll']),
            searchCategoryTabList: getLocator(this.page, configs['searchCategoryTabList']),
            searchActiveTab: getLocator(this.page, configs['searchActiveTab']),
        };
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
}
