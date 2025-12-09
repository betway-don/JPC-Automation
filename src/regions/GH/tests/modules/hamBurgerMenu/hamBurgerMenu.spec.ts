import { test } from '../../../fixtures/jackpotCityFixture';
import { runHamburgerMenuTests } from '../../../../../common/tests/hamburgerMenu.shared';

test.describe('GH Hamburger Menu Tests', () => {
    runHamburgerMenuTests(test, '/', { excludeTags: ['@T14'] });
});
