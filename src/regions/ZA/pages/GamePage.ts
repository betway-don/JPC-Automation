import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { GamePage as CommonGamePage } from '../../../common/pages/GamePage';

export class GamePage extends CommonGamePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
