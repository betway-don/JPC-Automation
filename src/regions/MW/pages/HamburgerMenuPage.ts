import { Page } from '@playwright/test';
import { SafeActions } from '../../../common/actions/SafeActions';
import { HamburgerMenuPage as CommonHamburgerMenuPage } from '../../../common/pages/HamburgerMenuPage';

export class HamburgerMenuPage extends CommonHamburgerMenuPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }
}
