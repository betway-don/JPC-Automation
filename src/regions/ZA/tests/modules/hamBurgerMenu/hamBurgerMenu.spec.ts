import { test } from '../../../fixtures/jackpotCityFixture';
import { runHamburgerMenuTests } from '../../../../../common/tests/hamburgerMenu.shared';

test.describe('Build A Bet Section Tests', () => {
    runHamburgerMenuTests(
        test,
        'https://www.jackpotcity.co.za/'
    );
});