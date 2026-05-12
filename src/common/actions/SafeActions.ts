import { Page, Locator } from '@playwright/test';
import { highlightElements } from './HighlightElements'; // Adjust path if needed
import { AIClient } from '../../global/utils/ai/AiClient';

/**
 * Provides self-healing actions (click, fill) with a 3-level fallback.
 * 1. Primary Locator (from Excel)
 * 2. Heuristic Locator (auto-generated from key)
 * 3. AI Healer (LLM call as last resort)
 */
export class SafeActions {
    private aiClient: AIClient;

    private defaultTimeout: number;

    constructor(public page: Page) {
        this.aiClient = new AIClient();
        this.defaultTimeout = process.env.ANDROID_DEVICE ? 30000 : 5000;
    }

    /**
     * Attempts to click an element using the 3-level fallback.
     * @param key The locator key (e.g., 'registerButton') for context.
     * @param primaryLocator The L1 locator (from Excel).
     * @param options Optional Playwright click options (e.g., timeout).
     */
    async safeClick(key: string, primaryLocator: Locator, options?: { timeout?: number }) {
        try {
            // --- Level 1: Try Primary Locator (from Excel) ---
            await primaryLocator.click({ timeout: options?.timeout || this.defaultTimeout });
        } catch (e1) {
            console.warn(`[Self-Heal L2] Primary locator for '${key}' failed. Trying heuristic...`);

            // --- Level 2: Try Heuristic Fallback ---
            const heuristicLocator = this.generateHeuristic(key);

            if (heuristicLocator) {
                try {
                    await heuristicLocator.click({ timeout: options?.timeout || this.defaultTimeout });
                    console.log(`[Self-Heal L2] SUCCESS: Heuristic click worked for '${key}'.`);
                    return; // Success!
                } catch (e2) {
                    console.warn(`[Self-Heal L3] Heuristic for '${key}' also failed. Calling AI...`);
                    // L2 failed, fall through to L3
                }
            } else {
                console.warn(`[Self-Heal L3] No heuristic for '${key}'. Calling AI directly...`);
            }

            // --- Level 3: AI Healer ---
            // Capture current page state
            const pageContent = await this.page.content();
            const aiLocatorString = await this.aiClient.getSuggestedLocator(key, primaryLocator.toString(), pageContent);

            if (aiLocatorString) {
                try {
                    console.log(`[Self-Heal L3] AI suggested locator: ${aiLocatorString}`);
                    // AI provides a new string (CSS, XPath, etc.)
                    await this.page.locator(aiLocatorString).click({ timeout: options?.timeout || this.defaultTimeout });
                    console.log(`[Self-Heal L3] SUCCESS: AI found new locator: ${aiLocatorString}`);
                } catch (e3) {
                    console.error(`[Self-Heal L3] FAILED: AI-suggested locator also failed.`);
                    throw e3; // Throw the final AI error
                }
            } else {
                console.error(`[Self-Heal L3] FAILED: AI returned no suggestion.`);
                throw e1; // Re-throw the *original* L1 error
            }
        }
    }

    /**
     * Attempts to fill an input using the 3-level fallback.
     */
    async safeFill(key: string, primaryLocator: Locator, text: string) {
        try {
            // L1
            await primaryLocator.fill(text, { timeout: this.defaultTimeout });
        } catch (e1) {
            // L2
            const heuristic = this.generateHeuristic(key);
            if (heuristic) {
                try {
                    await heuristic.fill(text, { timeout: this.defaultTimeout });
                    return;
                } catch (e2) {
                    // L3 (AI)
                    console.warn(`[Self-Heal L3] Heuristic fill for '${key}' failed. Skipping AI for fills (not implemented yet).`);
                    throw e2;
                }
            }
            throw e1; // No heuristic, re-throw
        }
    }

    /**
     * Generates a Level 2 "heuristic" locator based on a known key.
     */
    private generateHeuristic(key: string): Locator | null {
        // --- Build your "dictionary" of heuristics here ---
        if (key === 'registerButton') {
            // Header register button is NOT disabled; the in-form Sign Up button always starts disabled
            return this.page.locator("button[element-name='jpc-register']:not([disabled])");
        }
        if (key === 'menuButton') {
            return this.page.getByRole('button', { name: /menu/i });
        }
        if (key === 'loginButton') {
            return this.page.getByRole('button', { name: /Login/i });
        }
        if (key === 'mobileInput') {
            // The mobile input uses aria-label="username" (tel input), not "Mobile"
            return this.page.locator('#username');
        }
        if (key === 'passwordInput') {
            // Use ID to avoid matching passwordConfirmation (both have name~=/Password/i in GH)
            return this.page.locator('#password');
        }
        if (key === 'firstNameInput') {
            return this.page.getByRole('textbox', { name: /First Name/i });
        }
        if (key === 'lastNameInput') {
            return this.page.getByRole('textbox', { name: /Last Name|Surname/i });
        }
        if (key === 'emailInput') {
            return this.page.getByRole('textbox', { name: /Email/i });
        }
        if (key === 'nextButton') {
            return this.page.getByRole('button', { name: /Next/i });
        }
        if (key === 'signUpFormButton') {
            return this.page.getByRole('button', { name: /Sign Up|Register/i });
        }

        return null; // No heuristic available, will go straight to AI
    }

    /**
     * A self-healing highlight.
     */
    async safeHighlight(key: string, primary: Locator) {
        try {
            await primary.waitFor({ state: 'attached', timeout: 2000 });
            await highlightElements(primary);
        } catch (e) {
            const heuristic = this.generateHeuristic(key);
            if (heuristic) {
                try {
                    await heuristic.waitFor({ state: 'attached', timeout: 2000 });
                    await highlightElements(heuristic);
                } catch (e2) { /* ignore */ }
            }
        }
    }
}
