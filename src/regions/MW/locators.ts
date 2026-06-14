import { RegionOverrides, css } from '../../common/locators/sel';

/**
 * MW locator overrides — only where MW markup differs from the base (ZA) Page Objects.
 *
 * Notes on MW structural differences handled elsewhere (NOT via overrides):
 *  - Game categories live in a separate header nav scroller, not the hamburger drawer (HM-024..029).
 *  - Winners Circle feature is absent (suite skipped); the home page is a different layout
 *    (regions/MW has its own GhHomePage + suite).
 */
export const mwOverrides: RegionOverrides = {
    search: {
        // MW search-result tiles are image-only — the game name is on the card's aria-label / img alt,
        // with no separate visible text caption like ZA's `strong.line-clamp-1`.
        searchGameTitle: css('[role="dialog"] a.game-card[href*="sea=true"][aria-label]:visible'),
    },
};
