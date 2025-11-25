import { Page } from '@playwright/test';

/**
 * AI Client to interact with LLM providers (OpenAI, Gemini, etc.)
 * for self-healing locators.
 */
export class AIClient {
    private apiKey: string | undefined;
    private provider: 'openai' | 'gemini' = 'openai'; // Default to OpenAI for now, can be config driven

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
        if (process.env.GEMINI_API_KEY) {
            this.provider = 'gemini';
        }
    }

    /**
     * Asks the AI to suggest a new locator for a failed element.
     * @param elementDescription Description or key of the element (e.g., "loginButton")
     * @param originalLocator The locator that failed (e.g., "text=Login")
     * @param pageSource A snippet of the HTML surrounding the area (or full body if needed)
     */
    async getSuggestedLocator(elementDescription: string, originalLocator: string, pageSource: string): Promise<string | null> {
        if (!this.apiKey) {
            console.warn("[AIClient] No API Key found (OPENAI_API_KEY or GEMINI_API_KEY). Skipping AI healing.");
            return null;
        }

        // Truncate page source to avoid token limits if necessary, 
        // though for modern models 100k+ context is fine. 
        // For cost/speed, maybe we just take the body or a relevant section if possible.
        // For now, we'll use a reasonable substring if it's huge.
        const truncatedSource = pageSource.length > 50000 ? pageSource.substring(0, 50000) + "..." : pageSource;

        const prompt = `
        You are a Playwright automation expert. 
        A test failed because a locator could not be found.
        
        Element Description: "${elementDescription}"
        Original (Failed) Locator: "${originalLocator}"
        
        Here is a snippet of the current page HTML:
        \`\`\`html
        ${truncatedSource}
        \`\`\`
        
        Please analyze the HTML and suggest a ROBUST Playwright locator (CSS or XPath or Role) 
        that identifies this element. 
        
        Return ONLY the locator string. Do not return markdown formatting, explanations, or code blocks. 
        Just the string.
        `;

        try {
            if (this.provider === 'openai') {
                return await this.callOpenAI(prompt);
            } else {
                return await this.callGemini(prompt);
            }
        } catch (error) {
            console.error("[AIClient] Error calling AI provider:", error);
            return null;
        }
    }

    private async callOpenAI(prompt: string): Promise<string | null> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o', // or gpt-3.5-turbo
                messages: [{ role: 'user', content: prompt }],
                temperature: 0
            })
        });

        if (!response.ok) {
            console.error(`[AIClient] OpenAI API failed: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content?.trim();
        return this.cleanLocator(content);
    }

    private async callGemini(prompt: string): Promise<string | null> {
        // Gemini API implementation (simplified)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            console.error(`[AIClient] Gemini API failed: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        return this.cleanLocator(content);
    }

    private cleanLocator(locator: string | undefined): string | null {
        if (!locator) return null;
        // Remove any markdown code ticks if the LLM ignored instructions
        return locator.replace(/`/g, '').replace(/^playwright\s*/i, '').trim();
    }
}
