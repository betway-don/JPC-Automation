import { RegionOverrides, css } from '../../common/locators/sel';

/**
 * TZ locator overrides — only where TZ markup differs from the base (ZA) Page Objects.
 * TZ closely mirrors GH (same landing-page layout), so it starts from GH's known differences.
 * Refine via discovery as TZ suites are run (en.jackpotcitycasino.co.tz).
 */
export const tzOverrides: RegionOverrides = {
    search: {
        // Like GH, TZ search-result tiles are image-only — the game name is on the card's
        // aria-label / img alt, not a separate visible text caption.
        searchGameTitle: css('[role="dialog"] a.game-card[href*="sea=true"][aria-label]:visible'),
    },
};
