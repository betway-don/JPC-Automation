import { Page } from '@playwright/test';
import { GamePage as CommonGamePage } from '../../../common/pages/GamePage';
import { SafeActions } from '../../../common/actions/SafeActions';

/**
 * GH GamePage — in-game structure (top bar, hamburger, share, account options) matches ZA; only
 * navigation differs: GH's home has no featured carousel, so we reach a game via the Slot Games
 * vertical. navigateViaVertical() skips a geo-blocked slot-#1 game and tries the next card.
 */
export class GamePage extends CommonGamePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }

    async navigate() {
        await this.navigateViaVertical('/spingames');
    }
}
