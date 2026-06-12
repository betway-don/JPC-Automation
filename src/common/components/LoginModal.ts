import { Page, Locator, expect } from '@playwright/test';

/**
 * Component Object for the Login modal — the single owner of every login-modal selector.
 * Reused by any suite that surfaces login (login, header, hamburger, promotions, …).
 */
export class LoginModal {
    constructor(private readonly page: Page) {}

    get dialog(): Locator { return this.page.locator("[role='dialog'][aria-labelledby='Login-modal-title']"); }
    get title(): Locator { return this.page.locator('#Login-modal-title'); }
    get closeButton(): Locator { return this.dialog.locator("button[element-name='close-modal']"); }
    get form(): Locator { return this.page.locator('#login-form'); }
    get username(): Locator { return this.page.locator('#login-form #username'); }
    get password(): Locator { return this.page.locator('#login-form #password'); }
    get eyeIcon(): Locator { return this.page.locator("#login-form div[data-pc-name='password'] svg"); }
    get submitButton(): Locator { return this.dialog.getByRole('button', { name: 'Submit' }); }
    /** Field-level or form-level error feedback (field errors + the error-coloured toast icon). */
    get errorFeedback(): Locator { return this.page.locator("span[id$='-error'], [class*='error-500']"); }
    get invalidCredentialsError(): Locator { return this.dialog.getByText(/incorrect username or password/i); }
    get registerLink(): Locator { return this.dialog.getByText('Register', { exact: true }); }
    get forgotPasswordLink(): Locator { return this.dialog.getByText('Forgot Password?', { exact: true }); }
    /** Any modal title — used to detect the modal switching (e.g. to Password Reset). */
    get anyModalTitle(): Locator { return this.page.locator("[id$='-modal-title']").first(); }

    async expectOpen(): Promise<void> {
        await expect(this.dialog).toBeVisible({ timeout: 15000 });
        await expect(this.username).toBeVisible({ timeout: 10000 });
    }

    /** A login attempt must be blocked at Submit, or rejected with feedback while staying logged out. */
    async expectLoginRejected(): Promise<void> {
        if (await this.submitButton.isDisabled().catch(() => false)) return;
        await this.submitButton.click();
        await expect(this.dialog).toBeVisible({ timeout: 10000 });
        await expect(this.errorFeedback.first()).toBeVisible({ timeout: 10000 });
    }
}
