import { test } from '../../../fixtures/jackpotCityFixture';
import { runHamburgerMenuTests } from '../../../../../common/tests/hamburgerMenu.shared';

test.describe('Hamburger Menu Tests', () => {
    runHamburgerMenuTests(test, '/');
});