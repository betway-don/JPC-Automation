import { test as base, Page } from '@playwright/test';
import path from 'path';
import { launchAndroidBrowser } from '../../../common/utils/androidUtils';
import * as fs from 'fs';
// Adjust paths to wherever your files are located
import { SignUpPage } from '../pages/SignUpPage';
import { LoginPage } from '../pages/LoginPage';
import { HeaderPage } from '../pages/HeaderPage';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage';
import { PromotionsPage } from '../pages/PromotionsPage';
import { SearchPage } from '../pages/SearchPage';
import { WinnersCirclePage } from '../pages/WinnersCirclePage';
import { GamePage } from '../pages/GamePage';
import { HomePage } from '../pages/HomePage';
import { LoginModal } from '../../../common/components/LoginModal';
import { SignUpModal } from '../../../common/components/SignUpModal';
import { SafeActions } from '../../../common/actions/SafeActions';

// 1. Define the shape of your new JSON data
export interface FullTestData {
    step1: { [key: string]: string };
    step2: { [key: string]: string };
    mobileValidation: { [key: string]: string };
    passwordValidation: { [key: string]: string };
    nameValidation: { [key: string]: string };
    loginValid: { [key: string]: string };
    loginInvalid: { [key: string]: string };
    loginPartial: { [key: string]: string };
}

// 2. Read the JSON file
const testDataPath = path.resolve(__dirname, '../json-data/JackpotCityData.json');
if (!fs.existsSync(testDataPath)) {
    console.error(`[Fixture Error] Could not find JackpotCityData.json at: ${testDataPath}`);
    process.exit(1);
}
const testDataFile = fs.readFileSync(testDataPath, 'utf-8');
const allTestData: FullTestData = JSON.parse(testDataFile);

// 3. Define your fixture types
type JackpotCityFixtures = {
    signupPage: SignUpPage;
    loginPage: LoginPage;
    hamburgerMenuPage: HamburgerMenuPage;
    headerPage: HeaderPage;
    transactionHistoryPage: TransactionHistoryPage;
    promotionsPage: PromotionsPage;
    searchPage: SearchPage;
    winnersCirclePage: WinnersCirclePage;
    gamePage: GamePage;
    homePage: HomePage;
    loginModal: LoginModal;
    signUpModal: SignUpModal;
    safeActions: SafeActions;
    testData: FullTestData;
    screenshotDir: string;
    pageMonitor: void;
};

// 4. Extend the base test
const testBase = base.extend<JackpotCityFixtures>({
    testData: async ({ }, use) => {
        await use(allTestData);
    },

    screenshotDir: async ({ }, use) => {
        const projectRoot = path.resolve(__dirname, '../../../../');
        const screenshotDir = path.join(projectRoot, 'screenshots/regions/ZA/jackpotcity-tests');
        fs.mkdirSync(screenshotDir, { recursive: true });
        await use(screenshotDir);
    },

    safeActions: async ({ page }, use) => {
        await use(new SafeActions(page));
    },

    signupPage: async ({ page, safeActions }, use) => {
        const signupPage = new SignUpPage(page, safeActions);
        await use(signupPage);
    },

    loginPage: async ({ page, safeActions }, use) => {
        const loginPage = new LoginPage(page, safeActions);
        await use(loginPage);
    },

    hamburgerMenuPage: async ({ page, safeActions }, use) => {
        const hamburgerMenuPage = new HamburgerMenuPage(page, safeActions);
        await use(hamburgerMenuPage);
    },

    headerPage: async ({ page, safeActions }, use) => {
        const headerPage = new HeaderPage(page, safeActions);
        await use(headerPage);
    },

    transactionHistoryPage: async ({ page, safeActions }, use) => {
        const transactionHistoryPage = new TransactionHistoryPage(page, safeActions);
        await use(transactionHistoryPage);
    },

    promotionsPage: async ({ page, safeActions }, use) => {
        const promotionsPage = new PromotionsPage(page, safeActions);
        await use(promotionsPage);
    },

    searchPage: async ({ page, safeActions }, use) => {
        const searchPage = new SearchPage(page, safeActions);
        await use(searchPage);
    },

    winnersCirclePage: async ({ page, safeActions }, use) => {
        const winnersCirclePage = new WinnersCirclePage(page, safeActions);
        await use(winnersCirclePage);
    },

    gamePage: async ({ page, safeActions }, use) => {
        const gamePage = new GamePage(page, safeActions);
        await use(gamePage);
    },

    homePage: async ({ page, safeActions }, use) => {
        const homePage = new HomePage(page, safeActions);
        await use(homePage);
    },

    loginModal: async ({ page }, use) => {
        await use(new LoginModal(page));
    },

    signUpModal: async ({ page }, use) => {
        await use(new SignUpModal(page));
    },

    // Invariant monitor: records JS errors and failed first-party requests during every test
    // and attaches them to the report. Catches bugs no explicit assertion looks for
    // (broken API calls, console exceptions) without making any test fail or flake.
    pageMonitor: [async ({ page }, use, testInfo) => {
        const consoleErrors: string[] = [];
        const failedRequests: string[] = [];
        page.on('pageerror', err => consoleErrors.push(`pageerror: ${String(err).slice(0, 500)}`));
        page.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(`console: ${msg.text().slice(0, 500)}`);
        });
        page.on('response', resp => {
            try {
                const url = resp.url();
                // first-party failures only — third-party trackers 404 constantly
                if (resp.status() >= 400 && url.includes('jackpotcity')) {
                    failedRequests.push(`${resp.status()} ${url.slice(0, 300)}`);
                }
            } catch { /* response may be gone */ }
        });
        await use();
        // Let the page settle before Playwright's automatic end-of-test screenshot (screenshot: 'on'),
        // so evidence isn't captured mid-render / half-loaded.
        await page.waitForTimeout(1500).catch(() => { });
        if (consoleErrors.length) {
            await testInfo.attach('console-errors', { body: consoleErrors.join('\n'), contentType: 'text/plain' });
        }
        if (failedRequests.length) {
            await testInfo.attach('failed-requests', { body: failedRequests.join('\n'), contentType: 'text/plain' });
        }
    }, { auto: true }],
});

export const test = process.env.ANDROID_DEVICE
    ? testBase.extend({
        page: async ({ baseURL }, use) => {
            // Increase timeout for Android
            testBase.setTimeout(120000);

            const { page, context, device } = await launchAndroidBrowser(baseURL);

            await use(page);

            await page.close();
            await context.close();
            await device.close();
        }
    })
    : testBase;