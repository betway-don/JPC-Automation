import { Page, TestType, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { HeaderPage } from '../pages/HeaderPage';

const VALID_QUERY = 'hot hot';
const PARTIAL_QUERY = 'hot';
const INVALID_QUERY = 'xyzabc123qqqq';
const CATEGORY_NAME = 'Home';

type SearchNewSuiteFixtures = {
    page: Page;
    searchPage: SearchPage;
    headerPage: HeaderPage;
    testData: any;
};

export async function runSearchNewSuiteTests(
    test: TestType<SearchNewSuiteFixtures, any>,
    url: string
) {

    test.describe('Game Search - Logged Out', () => {

        test.beforeEach(async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.goto(url);
        });

        test('GS-LO-001 - search bar is shown in the header', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await expect(searchPage.searchButton).toBeVisible();
        });

        test('GS-LO-002 - the search modal opens', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.expectModalOpen();
        });

        test('GS-LO-003 - a matching game tile appears for a search', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            await expect(searchPage.firstGameCard).toBeVisible();
        });

        test('GS-LO-004 - results are relevant to the keyword', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            await searchPage.expectRelevant(/hot/i);
        });

        test('GS-LO-005 - each tile shows a loaded thumbnail and title', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.expectThumbnailLoaded();
            await expect(searchPage.gameTitle).toBeVisible();
        });

        test('GS-LO-006 - the search text can be cleared', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.clearByKeyboard();
            await searchPage.expectInputEmpty();
        });

        test('GS-LO-007 - the modal closes via the X icon', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.closeByX();
            await searchPage.expectModalClosed();
        });

        test('GS-LO-008 - clicking a tile opens that game page', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            const gamePath = await searchPage.launchFirstResult();
            expect(gamePath).toContain('/home/');
            await searchPage.expectAt(new RegExp(gamePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
            await expect(searchPage.playNowButton).toBeVisible();
        });

        test('GS-LO-009 - results reset after clearing the input', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.clearByKeyboard();
            await searchPage.expectResultsHidden();
        });

        test('GS-LO-010 - empty state shows when nothing matches', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(INVALID_QUERY);
            await searchPage.expectNoResults();
        });

    });

    test.describe('Game Search - Logged In', () => {

        test.beforeEach(async ({ searchPage, headerPage, testData }: SearchNewSuiteFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Logged-in: pending test account');
            await searchPage.goto(url);
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
        });

        test('GS-LI-001 - search bar is shown in the header', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await expect(searchPage.searchButton).toBeVisible();
        });

        test('GS-LI-002 - the search modal opens', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.expectModalOpen();
        });

        test('GS-LI-003 - matching tiles appear for a valid search', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            await searchPage.expectResults();
        });

        test('GS-LI-004 - search works with a partial name', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.expectResults();
        });

        test('GS-LI-005 - empty state shows for an invalid search', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(INVALID_QUERY);
            await searchPage.expectNoResults();
        });

        test('GS-LI-006 - a matching game tile appears', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            await expect(searchPage.firstGameCard).toBeVisible();
        });

        test('GS-LI-007 - each tile shows a loaded thumbnail', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.expectThumbnailLoaded();
        });

        test('GS-LI-008 - the search text can be cleared with the keyboard', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.clearByKeyboard();
            await searchPage.expectInputEmpty();
        });

        test('GS-LI-009 - the search text can be cleared with the clear button', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await expect(searchPage.clearButton).toBeVisible();
            await searchPage.clearByButton();
            await searchPage.expectInputEmpty();
        });

        test('GS-LI-010 - category tabs appear after a search', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            await expect(searchPage.categoryTabs).toBeVisible();
        });

        test('GS-LI-011 - the "All" category shows results', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            await searchPage.selectCategory('All');
            await searchPage.expectResults();
            await searchPage.expectActiveCategory('All');
        });

        test('GS-LI-012 - selecting a category filters to a subset of results', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            const allResults = await searchPage.resultHrefs();
            await searchPage.selectCategory(CATEGORY_NAME);
            await searchPage.expectResults();
            await searchPage.expectResultsSubsetOf(allResults);
        });

        test('GS-LI-013 - the active category tab is highlighted', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.selectCategory(CATEGORY_NAME);
            await searchPage.expectActiveCategory(CATEGORY_NAME);
        });

        test('GS-LI-014 - results update when switching categories', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.selectCategory('All');
            await searchPage.expectActiveCategory('All');
            await searchPage.selectCategory(CATEGORY_NAME);
            await searchPage.expectActiveCategory(CATEGORY_NAME);
        });

        test('GS-LI-015 - result count narrows for a category vs All', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.selectCategory('All');
            const allCount = await searchPage.resultCount();
            await searchPage.selectCategory(CATEGORY_NAME);
            expect(await searchPage.resultCount()).toBeLessThanOrEqual(allCount);
        });

        test('GS-LI-016 - no unrelated games appear in a category', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.selectCategory(CATEGORY_NAME);
            await searchPage.expectRelevant(/hot/i);
        });

        test('GS-LI-017 - category tabs stay visible after refining the keyword', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            await searchPage.clearByKeyboard();
            await searchPage.search(PARTIAL_QUERY);
            await expect(searchPage.categoryTabs).toBeVisible();
        });

        test('GS-LI-018 - results show when a category has matching games', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.selectCategory(CATEGORY_NAME);
            await searchPage.expectResults();
        });

        test('GS-LI-019 - empty state shows when no games match the category', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(INVALID_QUERY);
            await searchPage.expectNoResults();
        });

        test('GS-LI-020 - tiles show image and title within a category', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.selectCategory(CATEGORY_NAME);
            await expect(searchPage.gameImage).toBeVisible();
            await expect(searchPage.gameTitle).toBeVisible();
        });

        test('GS-LI-021 - results load within an acceptable time', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.expectSearchRespondsWithin(PARTIAL_QUERY, 10000);
        });

        test('GS-LI-022 - games can be found by category-related keywords', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search('roulette');
            await searchPage.expectRelevant(/roulette/i);
        });

        test('GS-LI-023 - clicking a tile launches the game', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            const gamePath = await searchPage.launchFirstResult();
            expect(gamePath).toContain('/home/');
            await searchPage.expectAt(new RegExp(gamePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
            await expect(searchPage.gameFrame).toBeVisible({ timeout: 30000 });
        });

        test('GS-LI-024 - results can be scrolled', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.scrollResults();
            await expect(searchPage.resultsGrid).toBeVisible();
        });

        test('GS-LI-025 - results reset after clearing the input', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(PARTIAL_QUERY);
            await searchPage.clearByKeyboard();
            await searchPage.expectInputEmpty();
        });

        test('GS-LI-026 - no duplicate tiles in results', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            await searchPage.selectCategory(CATEGORY_NAME);
            await searchPage.expectNoDuplicateResults();
        });

        test('GS-LI-027 - the modal closes via the X icon', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.closeByX();
            await searchPage.expectModalClosed();
        });

        test('GS-LI-028 - the modal closes via the Escape key', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.closeByEsc();
            await searchPage.expectModalClosed();
        });

        test('GS-LI-029 - the latest query is kept in recent searches', async ({ searchPage }: SearchNewSuiteFixtures) => {
            await searchPage.open();
            await searchPage.search(VALID_QUERY);
            await searchPage.clearByKeyboard();
            await expect(searchPage.recentSearches).toBeVisible();
            expect(await searchPage.recentSearchText()).toBe(VALID_QUERY);
        });

    });

}
