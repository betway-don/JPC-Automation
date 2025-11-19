import { test as base, Page } from '@playwright/test';
import path from 'path';
import * as fs from 'fs';
// Adjust paths to wherever your files are located
import { SignUpPage } from '../pages/SignUpPage'; 
import { LoginPage } from '../pages/LoginPage'; 
import { SafeActions } from '../../Common-Flows/SafeActions';

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
  safeActions: SafeActions;
  testData: FullTestData;
  screenshotDir: string;
};

// 4. Extend the base test
export const test = base.extend<JackpotCityFixtures>({
    testData: async ({}, use) => {
        await use(allTestData);
    },

    screenshotDir: async ({}, use) => {
        const projectRoot = path.resolve(__dirname, '..'); 
        const screenshotDir = path.join(projectRoot, 'screenshots/module/jackpotcity-login');
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
});