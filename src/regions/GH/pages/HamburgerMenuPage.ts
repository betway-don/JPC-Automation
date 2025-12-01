import { Page } from '@playwright/test';
import { HamburgerMenuPage as CommonHamburgerMenuPage } from '../../../common/pages/HamburgerMenuPage';
import { SafeActions } from '../../../common/actions/SafeActions';

export class HamburgerMenuPage extends CommonHamburgerMenuPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
