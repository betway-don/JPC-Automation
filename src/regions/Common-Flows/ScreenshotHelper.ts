export async function ScreenshotHelper(page: import('@playwright/test').Page, screenshotDir: string, testId: string, testInfo: any) {
    const screenshotPath = `${screenshotDir}/${testId}.png`;
    await page.waitForTimeout(2000);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    await testInfo.attach(`${testId}`, { 
        path: screenshotPath ,
        contentType: 'image/png'
    });
    await page.waitForTimeout(2000);
}
// 1.npx playwright test src/regions/ZA/tests/modules/footer/footer.spec.ts --config=playwright.ZA.config.ts --headed    
// 2.allure generate allure-results --clean -o src/regions/ZA/reports/allure-report
// 3.allure open src/regions/ZA/reports/allure-report   