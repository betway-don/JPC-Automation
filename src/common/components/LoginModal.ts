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

    // ── intent helpers ──────────────────────────────────────────────────────────
    async typeUsername(text: string): Promise<void> { await this.username.pressSequentially(text, { delay: 30 }); }
    async fillPassword(text: string): Promise<void> { await this.password.fill(text); }
    async submit(): Promise<void> { await this.submitButton.click(); }
    async togglePasswordVisibility(): Promise<void> { await this.eyeIcon.click(); }
    async openRegister(): Promise<void> { await this.registerLink.click(); }
    async openPasswordReset(): Promise<void> { await this.forgotPasswordLink.click(); }

    /** Try to attempt a login with the given credentials and assert it is rejected. */
    async attemptAndExpectRejected(mobile: string, password?: string): Promise<void> {
        if (mobile) await this.typeUsername(mobile);
        if (password) await this.fillPassword(password);
        await this.expectLoginRejected();
    }
    /** Typing junk into the mobile field must leave only digits. */
    async expectMobileRejectsNonDigits(junk: string): Promise<void> {
        await this.username.pressSequentially(junk, { delay: 50 });
        expect(await this.username.inputValue(), `mobile field accepted "${junk}"`).toMatch(/^\d*$/);
    }
    /** Long mobile: the field caps at 9 digits, or the over-length attempt is rejected. */
    async expectLongMobileHandled(digits: string, password: string): Promise<void> {
        await this.username.pressSequentially(digits, { delay: 30 });
        const v = await this.username.inputValue();
        if (v.length <= 9) expect(v.length).toBeLessThanOrEqual(9);
        else { await this.fillPassword(password); await this.expectLoginRejected(); }
    }
    /** Long password: the field caps at 20 chars, or the over-length attempt is rejected. */
    async expectLongPasswordHandled(mobile: string): Promise<void> {
        await this.password.pressSequentially('Abcdefgh1'.repeat(3), { delay: 20 });
        const v = await this.password.inputValue();
        if (v.length <= 20) expect(v.length).toBeLessThanOrEqual(20);
        else { await this.typeUsername(mobile); await this.expectLoginRejected(); }
    }
    async expectPasswordMasked(): Promise<void> { await expect(this.password).toHaveAttribute('type', 'password'); }
    async expectPasswordVisible(): Promise<void> { await expect(this.password).toHaveAttribute('type', 'text'); }
    async expectSubmitDisabled(): Promise<void> { await expect(this.submitButton).toBeDisabled(); }
    async expectInvalidCredentials(): Promise<void> {
        await expect(this.invalidCredentialsError).toBeVisible();
        await expect(this.dialog).toBeVisible();
    }
    async expectForgotPasswordVisible(): Promise<void> { await expect(this.forgotPasswordLink).toBeVisible(); }
    // ── Password Reset prompt (asks for the mobile / account number) ────────────
    get resetDialog(): Locator { return this.page.locator("[role='dialog'][aria-labelledby='Password Reset-modal-title']"); }
    get resetMobileInput(): Locator { return this.resetDialog.locator('#username'); }
    get resetContinueButton(): Locator { return this.resetDialog.getByRole('button', { name: /continue/i }); }

    /** On the reset prompt, Continue stays disabled for an invalid mobile/account number and enables
     *  only for a valid one. Deliberately stops before clicking Continue so no OTP SMS is sent. */
    async expectResetPromptValidatesMobile(): Promise<void> {
        await expect(this.resetMobileInput).toBeVisible({ timeout: 10000 });
        await expect(this.resetContinueButton).toBeDisabled();              // empty → blocked
        await this.resetMobileInput.fill('12');                             // too short → blocked
        await expect(this.resetContinueButton).toBeDisabled();
        await this.resetMobileInput.fill('');
        await this.resetMobileInput.pressSequentially('712345678', { delay: 20 });   // valid 9-digit
        await expect(this.resetContinueButton).toBeEnabled();
    }

    /** After tapping Forgot Password, the login form gives way to the reset prompt. */
    async expectSwitchedToReset(): Promise<void> {
        await expect.poll(async () => {
            const loginFormGone = !(await this.form.isVisible().catch(() => false));
            const titleChanged = !/^login$/i.test(((await this.anyModalTitle.textContent().catch(() => 'Login')) ?? '').trim());
            return loginFormGone || titleChanged;
        }, { timeout: 10000 }).toBe(true);
    }
}
