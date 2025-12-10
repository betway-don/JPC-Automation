import { test as base, Page } from '@playwright/test';
import path from 'path';
import { launchAndroidBrowser } from '../../../common/utils/androidUtils';
import * as fs from 'fs';
// Adjust paths to wherever your files are located
import { SignUpPage } from '../pages/SignUpPage';
import { LoginPage } from '../pages/LoginPage';
import { HeaderPage } from '../pages/HeaderPage';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';
import { LimitsPage } from '../pages/LimitsPage';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage';
import { UpdatePasswordPage } from '../pages/UpdatePasswordPage';
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
    limitsPage: LimitsPage;
    transactionHistoryPage: TransactionHistoryPage;
    updatePasswordPage: UpdatePasswordPage;
    safeActions: SafeActions;
    testData: FullTestData;
    screenshotDir: string;
};

// 4. Extend the base test
const testBase = base.extend<JackpotCityFixtures>({
    testData: async ({ }, use) => {
        await use(allTestData);
    },

    screenshotDir: async ({ }, use) => {
        const projectRoot = path.resolve(__dirname, '../../../../');
        const screenshotDir = path.join(projectRoot, 'screenshots/regions/MW/jackpotcity-tests');
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

    limitsPage: async ({ page, safeActions }, use) => {
        const limitsPage = new LimitsPage(page, safeActions);
        await use(limitsPage);
    },

    transactionHistoryPage: async ({ page, safeActions }, use) => {
        const transactionHistoryPage = new TransactionHistoryPage(page, safeActions);
        await use(transactionHistoryPage);
    },

    updatePasswordPage: async ({ page, safeActions }: { page: Page, safeActions: SafeActions }, use: (r: UpdatePasswordPage) => Promise<void>) => {
        const updatePasswordPage = new UpdatePasswordPage(page, safeActions);
        await use(updatePasswordPage);
    },
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
