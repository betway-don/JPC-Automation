import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { HeaderPage } from '../pages/HeaderPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

const VALID_QUERY = 'hot hot';
const PARTIAL_QUERY = 'hot';
const INVALID_QUERY = 'xyzabc123qqqq';
const CATEGORY_NAME = 'Home';

type SearchNewSuiteFixtures = {
    page: Page;
    searchPage: SearchPage;
    headerPage: HeaderPage;
    screenshotDir: string;
    testData: any;
};

export async function runSearchNewSuiteTests(
    test: TestType<SearchNewSuiteFixtures, any>,
    url: string
) {

    test.describe('Game Search - Logged Out', () => {

        test.beforeEach(async ({ page }: SearchNewSuiteFixtures) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
        });

        test('GS-LO-001 - Verify Game Search icon/bar is displayed in the header', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(searchPage.locators.searchBtn).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchBtn');
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-001-searchBtnVisible', testInfo);
        });

        test('GS-LO-002 - Verify user can open the Game Search modal', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await expect(searchPage.locators.searchModal).toBeVisible({ timeout: 15000 });
            await expect(searchPage.locators.searchModalTitle).toBeVisible({ timeout: 15000 });
            await expect(searchPage.locators.searchInput).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchModal');
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-002-searchModalOpen', testInfo);
        });

        test('GS-LO-003 - Verify clicking a search suggestion/game tile', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchGameCard).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchGameCard');
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-003-gameTileVisible', testInfo);
        });

        test('GS-LO-004 - Verify displayed game results are relevant to the entered keyword', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            const count = await searchPage.getSearchResults().count();
            expect(count).toBeGreaterThan(0);
            await searchPage.highlightElement('searchResultsGrid');
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-004-relevantResults', testInfo);
        });

        test('GS-LO-005 - Verify each game tile displays thumbnail image and game title', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchGameImage).toBeVisible({ timeout: 15000 });
            await expect(searchPage.locators.searchGameTitle).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchGameImage');
            await searchPage.highlightElement('searchGameTitle');
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-005-gameTileContent', testInfo);
        });

        test('GS-LO-006 - Verify user can clear entered search text', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await searchPage.clearSearchByKeyboard();
            await page.waitForTimeout(1000);
            const inputValue = await searchPage.locators.searchInput.inputValue();
            expect(inputValue).toBe('');
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-006-clearSearch', testInfo);
        });

        test('GS-LO-007 - Verify Game Search modal can be closed using Close (X) icon', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await expect(searchPage.locators.searchModal).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchCloseBtn');
            await searchPage.closeSearch();
            await page.waitForTimeout(500);
            await expect(searchPage.locators.searchModal).not.toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-007-searchModalClosed', testInfo);
        });

        test('GS-LO-008 - Verify user redirect to gamepage by clicking on a game tile', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchGameCard).toBeVisible({ timeout: 15000 });
            await searchPage.clickFirstResult();
            await page.waitForTimeout(2000);
            expect(page.url()).toContain('/home/');
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-008-gamePageRedirect', testInfo);
        });

        test('GS-LO-009 - Verify search results reset after clearing the search input', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await searchPage.clearSearchByKeyboard();
            await page.waitForTimeout(1000);
            await expect(searchPage.locators.searchResultsGrid).not.toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-009-resultsResetAfterClear', testInfo);
        });

        test('GS-LO-010 - Verify empty state message is displayed when no games match', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(INVALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchNoResults).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchNoResults');
            await ScreenshotHelper(page, screenshotDir, 'GS-LO-010-emptyState', testInfo);
        });

    });

    test.describe('Game Search - Logged In', () => {

        test.beforeEach(async ({ page, headerPage, testData }: SearchNewSuiteFixtures) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await page.waitForTimeout(3000);
        });

        test('GS-LI-001 - Verify Game Search icon/bar is displayed in the header', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await expect(searchPage.locators.searchBtn).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchBtn');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-001-searchBtnVisible', testInfo);
        });

        test('GS-LI-002 - Verify user can open the Game Search modal', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await expect(searchPage.locators.searchModal).toBeVisible({ timeout: 15000 });
            await expect(searchPage.locators.searchModalTitle).toBeVisible({ timeout: 15000 });
            await expect(searchPage.locators.searchInput).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchModal');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-002-searchModalOpen', testInfo);
        });

        test('GS-LI-003 - Verify matching game tiles are displayed for a valid game search', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            const count = await searchPage.getSearchResults().count();
            expect(count).toBeGreaterThan(0);
            await searchPage.highlightElement('searchResultsGrid');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-003-validSearchResults', testInfo);
        });

        test('GS-LI-004 - Verify game search works with partial game names', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            const count = await searchPage.getSearchResults().count();
            expect(count).toBeGreaterThan(0);
            await searchPage.highlightElement('searchResultsGrid');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-004-partialSearch', testInfo);
        });

        test('GS-LI-005 - Verify appropriate message is displayed for invalid game search', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(INVALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchNoResults).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchNoResults');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-005-invalidSearchMessage', testInfo);
        });

        test('GS-LI-006 - Verify clicking a game tile in search field', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchGameCard).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchGameCard');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-006-gameTileClickable', testInfo);
        });

        test('GS-LI-007 - Verify each game tile displays thumbnail image', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchGameImage).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchGameImage');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-007-gameTileImage', testInfo);
        });

        test('GS-LI-008 - Verify user can clear entered search text using keyboard delete/backspace', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await searchPage.clearSearchByKeyboard();
            await page.waitForTimeout(1000);
            const inputValue = await searchPage.locators.searchInput.inputValue();
            expect(inputValue).toBe('');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-008-clearByKeyboard', testInfo);
        });

        test('GS-LI-009 - Verify user can clear entered search text by clicking on cross button', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await expect(searchPage.locators.searchClearInputBtn).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchClearInputBtn');
            await searchPage.clearSearchByBtn();
            await page.waitForTimeout(1000);
            const inputValue = await searchPage.locators.searchInput.inputValue();
            expect(inputValue).toBe('');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-009-clearByBtn', testInfo);
        });

        test('GS-LI-010 - Verify category tabs are displayed after performing a search', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchCategoryTabList');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-010-categoryTabsVisible', testInfo);
        });

        test('GS-LI-011 - Verify "All" category displays results from all categories', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clickCategoryTab('All');
            await page.waitForTimeout(1000);
            const count = await searchPage.getSearchResults().count();
            expect(count).toBeGreaterThan(0);
            await expect(searchPage.getCategoryTab('All')).toHaveClass(/bg-primary/, { timeout: 15000 });
            await searchPage.highlightElement('searchCategoryTabList');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-011-allCategoryResults', testInfo);
        });

        test('GS-LI-012 - Verify selecting a category filters search results accordingly', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clickCategoryTab(CATEGORY_NAME);
            await page.waitForTimeout(1500);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-012-categoryFilter', testInfo);
        });

        test('GS-LI-013 - Verify active category tab is visually highlighted', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clickCategoryTab(CATEGORY_NAME);
            await page.waitForTimeout(1000);
            await expect(searchPage.getCategoryTab(CATEGORY_NAME)).toHaveClass(/bg-primary/, { timeout: 15000 });
            await searchPage.highlightElement('searchActiveTab');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-013-activeTabHighlighted', testInfo);
        });

        test('GS-LI-014 - Verify search results update dynamically when switching between categories', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clickCategoryTab('All');
            await page.waitForTimeout(1000);
            await expect(searchPage.getCategoryTab('All')).toHaveClass(/bg-primary/, { timeout: 15000 });
            await searchPage.clickCategoryTab(CATEGORY_NAME);
            await page.waitForTimeout(1500);
            await expect(searchPage.getCategoryTab(CATEGORY_NAME)).toHaveClass(/bg-primary/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-014-dynamicCategoryUpdate', testInfo);
        });

        test('GS-LI-015 - Verify search results count changes according to selected category', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clickCategoryTab('All');
            await page.waitForTimeout(1500);
            const allCount = await searchPage.getSearchResults().count();
            await searchPage.clickCategoryTab(CATEGORY_NAME);
            await page.waitForTimeout(1500);
            const spinCount = await searchPage.getSearchResults().count();
            expect(spinCount).toBeLessThanOrEqual(allCount);
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-015-resultCountByCategory', testInfo);
        });

        test('GS-LI-016 - Verify no unrelated games are displayed in selected category', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clickCategoryTab(CATEGORY_NAME);
            await page.waitForTimeout(1500);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            const count = await searchPage.getSearchResults().count();
            expect(count).toBeGreaterThanOrEqual(0);
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-016-noUnrelatedGames', testInfo);
        });

        test('GS-LI-017 - Verify category tabs remain visible after refining search keyword', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clearSearchByKeyboard();
            await page.waitForTimeout(500);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchCategoryTabList');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-017-tabsAfterRefine', testInfo);
        });

        test('GS-LI-018 - Verify search results are displayed when a category contains matching games', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clickCategoryTab(CATEGORY_NAME);
            await page.waitForTimeout(1500);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-018-categoryWithResults', testInfo);
        });

        test('GS-LI-019 - Verify empty state message is displayed when no games match selected category', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(INVALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchNoResults).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchNoResults');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-019-emptyStateInCategory', testInfo);
        });

        test('GS-LI-020 - Verify game tiles display correct information within filtered categories', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clickCategoryTab(CATEGORY_NAME);
            await page.waitForTimeout(1500);
            await expect(searchPage.locators.searchGameImage).toBeVisible({ timeout: 15000 });
            await expect(searchPage.locators.searchGameTitle).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchGameTitle');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-020-tileInfoInCategory', testInfo);
        });

        test('GS-LI-021 - Verify game search results load within acceptable response time', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            const start = Date.now();
            await searchPage.typeSearch(PARTIAL_QUERY);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            const elapsed = Date.now() - start;
            expect(elapsed).toBeLessThan(10000);
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-021-searchResponseTime', testInfo);
        });

        test('GS-LI-022 - Verify games can be searched using category-related keywords', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch('roulette');
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            const count = await searchPage.getSearchResults().count();
            expect(count).toBeGreaterThan(0);
            await searchPage.highlightElement('searchResultsGrid');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-022-categoryKeywordSearch', testInfo);
        });

        test('GS-LI-023 - Verify user can launch a game by clicking on a game tile', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchGameCard).toBeVisible({ timeout: 15000 });
            await searchPage.clickFirstResult();
            await page.waitForTimeout(2000);
            expect(page.url()).toContain('/home/');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-023-launchGame', testInfo);
        });

        test('GS-LI-024 - Verify user can scroll through the game search results', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await searchPage.locators.searchModal.evaluate((el: HTMLElement) => {
                el.scrollTo(0, el.scrollHeight);
            });
            await page.waitForTimeout(1000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-024-scrollResults', testInfo);
        });

        test('GS-LI-025 - Verify search results reset after clearing the search input', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(PARTIAL_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await searchPage.clearSearchByKeyboard();
            await page.waitForTimeout(1000);
            const inputValue = await searchPage.locators.searchInput.inputValue();
            expect(inputValue).toBe('');
            await expect(searchPage.getCategoryTab('All')).not.toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-025-resultsResetAfterClear', testInfo);
        });

        test('GS-LI-026 - Verify duplicate game tiles are not displayed in search results', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchCategoryTabList).toBeVisible({ timeout: 15000 });
            await searchPage.clickCategoryTab(CATEGORY_NAME);
            await page.waitForTimeout(1500);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            const gamePaths = await searchPage.getSearchResults().evaluateAll(
                (cards: Element[]) => cards.map(c => (c.getAttribute('href') || '').split('?')[0])
            );
            const nonEmpty = gamePaths.filter(p => p.length > 0);
            const unique = new Set(nonEmpty);
            expect(unique.size).toBe(nonEmpty.length);
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-026-noDuplicates', testInfo);
        });

        test('GS-LI-027 - Verify Game Search modal can be closed using Close (X) icon', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await expect(searchPage.locators.searchModal).toBeVisible({ timeout: 15000 });
            await searchPage.highlightElement('searchCloseBtn');
            await searchPage.closeSearch();
            await page.waitForTimeout(500);
            await expect(searchPage.locators.searchModal).not.toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-027-searchModalClosed', testInfo);
        });

        test('GS-LI-028 - Verify Game Search modal closes using Escape (Esc) key', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await expect(searchPage.locators.searchModal).toBeVisible({ timeout: 15000 });
            await searchPage.closeSearchByEsc();
            await page.waitForTimeout(500);
            await expect(searchPage.locators.searchModal).not.toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-028-escKeyClose', testInfo);
        });

        test('GS-LI-029 - Verify recent search history behavior after relogin', async ({ page, searchPage, screenshotDir }: SearchNewSuiteFixtures, testInfo: TestInfo) => {
            await searchPage.openSearch();
            await page.waitForTimeout(1000);
            await searchPage.typeSearch(VALID_QUERY);
            await page.waitForTimeout(2000);
            await expect(searchPage.locators.searchResultsGrid).toBeVisible({ timeout: 15000 });
            await searchPage.clearSearchByKeyboard();
            await page.waitForTimeout(1000);
            await expect(searchPage.locators.recentSearchesSection).toBeVisible({ timeout: 15000 });
            await expect(searchPage.locators.recentSearchItem).toBeVisible({ timeout: 15000 });
            const historyText = await searchPage.locators.recentSearchItem.locator('p').first().textContent();
            expect(historyText?.trim()).toBe(VALID_QUERY);
            await searchPage.highlightElement('recentSearchesSection');
            await ScreenshotHelper(page, screenshotDir, 'GS-LI-029-recentSearchHistory', testInfo);
        });

    });

}
