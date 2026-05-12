import { test } from '../../../fixtures/jackpotCityFixture';
import { runHamburgerMenuTests } from '../../../../../common/tests/hamburgerMenu.shared';

test.describe('TZ Hamburger Menu Tests', () => {
    runHamburgerMenuTests(test, '/', {
        excludeTags: [
            'T13', 'T14',           // Winners CTA, Blog CTA
            'T22', 'T23', 'T24'  // Get the App, Slot Categories, Live Categories (logged-out)
            
        ]
    });
});
