import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { WinnersCirclePage as CommonWinnersCirclePage } from '../../../common/pages/WinnersCirclePage';

export class WinnersCirclePage extends CommonWinnersCirclePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
