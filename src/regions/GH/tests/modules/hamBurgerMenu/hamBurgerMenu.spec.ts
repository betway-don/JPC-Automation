import { test } from '../../../fixtures/jackpotCityFixture';
import { runHamburgerMenuTests } from '../../../../../common/tests/hamburgerMenu.shared';

test.describe('GH Hamburger Menu Tests', () => {
    runHamburgerMenuTests(test, '/', {
        excludeTags: [
            'T13', 'T14',           // Winners CTA, Blog CTA
            'T22', 'T23', 'T24',    // Get the App, Slot Categories, Live Categories (logged-out)
            'T26', 'T27', 'T28',    // Apple Store, Android, App Gallery download buttons
            'T30', 'T32', 'T33',    // Balance widget, Eye toggle visible, Eye toggle hides
            'T37', 'T39', 'T40',    // Bonus Wallet, Account Settings, City Rewards
            'T49', 'T50', 'T51',    // Get the App, Slot Categories, Live Categories (logged-in)
            'T52', 'T53', 'T54', 'T55'  // Aviator, Slot Games, Betgames, Quick Games CTAs
        ]
    });
});
