import { test, expect } from '@playwright/test';

test('debug home page mark fav refresh', async ({ page }) => {
    await page.goto('https://jackpotcity.co.za/');
    const loginButton = page.getByRole('button', { name: 'Login' });
    if (await loginButton.isVisible()) {
        await loginButton.click();
        await page.getByRole('textbox', { name: 'username' }).fill('640987655');
        await page.getByRole('textbox', { name: 'password' }).fill('12345678');
        await page.getByRole('textbox', { name: 'password' }).press('Enter');
        await page.waitForLoadState('domcontentloaded');
    }
    
    await page.waitForTimeout(3000);
    
    // Check if fav section exists first
    let favTitle = page.locator('div', { hasText: 'Favourites' }).first();
    console.log('Favourites section before:', await favTitle.count());
    
    // Click the first fav button
    const firstFavButton = page.locator('[aria-label^="favorite-game"]').first();
    await firstFavButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await firstFavButton.click();
    
    // Wait and reload
    await page.waitForTimeout(2000);
    await page.reload();
    await page.waitForTimeout(3000);
    
    // Check again
    favTitle = page.locator('div', { hasText: 'Favourites' }).first();
    console.log('Favourites section after reload:', await favTitle.count());
});
