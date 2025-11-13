import { Page, Locator } from '@playwright/test';
import { highlightElements } from './HighlightElements'; // Adjust path if needed

/**
 * Provides self-healing actions (click, fill) with a 3-level fallback.
 * 1. Primary Locator (from Excel)
 * 2. Heuristic Locator (auto-generated from key)
 * 3. AI Healer (LLM call as last resort)
 */
export class SafeActions {

    constructor(public page: Page) {}

    /**
     * Attempts to click an element using the 3-level fallback.
     * @param key The locator key (e.g., 'registerButton') for context.
     * @param primaryLocator The L1 locator (from Excel).
     */
    async safeClick(key: string, primaryLocator: Locator) {
        try {
            // --- Level 1: Try Primary Locator (from Excel) ---
            await primaryLocator.click({ timeout: 5000 });
        } catch (e1) {
            console.warn(`[Self-Heal L2] Primary locator for '${key}' failed. Trying heuristic...`);
            
            // --- Level 2: Try Heuristic Fallback ---
            const heuristicLocator = this.generateHeuristic(key);

            if (heuristicLocator) {
                try {
                    await heuristicLocator.click({ timeout: 3000 });
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
            const aiLocatorString = await this.getAiSuggestion(key, primaryLocator.toString(), await this.page.content());
            
            if (aiLocatorString) {
                try {
                    // AI provides a new string (CSS, XPath, etc.)
                    await this.page.locator(aiLocatorString).click();
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
            await primaryLocator.fill(text, { timeout: 3000 });
        } catch (e1) {
            // L2
            const heuristic = this.generateHeuristic(key);
            if (heuristic) {
                try {
                    await heuristic.fill(text, { timeout: 3000 });
                    return;
                } catch (e2) {
                    // L3 (AI)
                    console.warn(`[Self-Heal L3] Heuristic fill for '${key}' failed. Skipping AI for fills.`);
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
            return this.page.getByRole('button', { name: /Register|Sign Up/i });
        }
        if (key === 'loginButton') {
            return this.page.getByRole('button', { name: /Login/i });
        }
        if (key === 'mobileInput') {
            return this.page.getByRole('textbox', { name: /Mobile/i });
        }
        if (key === 'passwordInput') {
            return this.page.getByRole('textbox', { name: /Password/i });
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
     * MOCK AI HEALER
     */
    private async getAiSuggestion(key: string, oldLocator: string, dom: string): Promise<string | null> {
        console.log(`[AI Healer] Querying LLM with key: '${key}'...`);
        // --- AI API Call would go here ---
        // const prompt = `Analyze this DOM... find '${key}'...`;
        // const response = await fetch('https://api.gemini.com/...', { body: ... });
        // const aiResult = await response.json();
        // return aiResult.locator;
        // ---------------------------------

        if (key === 'registerButton' && dom.includes("Create Account")) {
            return "role: 'button', name: 'Create Account'";
        }
        return null; // AI couldn't find a match
    }

    /**
     * A self-healing highlight.
     */
    async safeHighlight(key: string, primary: Locator) {
        try {
            await highlightElements(primary);
        } catch (e) {
            const heuristic = this.generateHeuristic(key);
            if (heuristic) {
                try {
                    await highlightElements(heuristic);
                } catch (e2) { /* ignore */ }
            }
        }
    }
}