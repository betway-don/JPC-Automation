import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { HomePage as CommonHomePage } from '../../../common/pages/HomePage';

export class HomePage extends CommonHomePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
