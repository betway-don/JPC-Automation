import { test, expect } from '@playwright/test';
test('debug scroll', async ({ page }) => {
    await page.goto('https://jackpotcity.co.za/');
    const loginButton = page.getByRole('button', { name: 'Login' });
    if (await loginButton.isVisible()) {
        await loginButton.click();
        await page.getByRole('textbox', { name: 'username' }).fill('640987655');
        await page.getByRole('textbox', { name: 'password' }).fill('12345678');
        await page.getByRole('textbox', { name: 'password' }).press('Enter');
        await page.waitForLoadState('domcontentloaded');
    }
    
    await page.locator('button[element-name="page-link-winners"]').click();
    await page.waitForTimeout(2000);
    
    const allWinnersTableContainer = page.locator('div.max-h-96.overflow-y-auto').first();
    const getScrollPos = async () => await page.locator('div.max-h-96.overflow-y-auto').last().evaluate((el: any) => el.scrollTop);
    
    console.log('Initial scroll:', await getScrollPos());
    
    await allWinnersTableContainer.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(500);
    await allWinnersTableContainer.hover({ position: { x: 50, y: 100 }, force: true });
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000);
    
    console.log('Final scroll:', await getScrollPos());
});
