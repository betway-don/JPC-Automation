import { Page } from '@playwright/test';
import { GamePage as CommonGamePage } from '../../../common/pages/GamePage';
import { SafeActions } from '../../../common/actions/SafeActions';

/**
 * GH GamePage — the in-game structure (top bar, hamburger, share, account options) matches ZA,
 * so only navigation differs: GH's home page has no featured-games carousel, so we reach a game
 * through the Slot Games vertical instead of the home carousel.
 */
export class GamePage extends CommonGamePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }

    async navigate() {
        await this.page.goto('/spingames', { waitUntil: 'domcontentloaded' });
        const card = this.page.locator('a.game-card').first();
        await card.waitFor({ state: 'visible', timeout: 20000 });
        await card.click();
        // GH launches games under /spingames/featured/<slug> (not ZA's /home/...), so wait for the
        // region-agnostic game shell (top bar) rather than a region-specific URL pattern.
        await this.page.waitForURL('**/featured/**', { timeout: 15000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.locators.topBar.waitFor({ state: 'visible', timeout: 15000 });
    }
}
