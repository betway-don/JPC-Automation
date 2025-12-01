import { test } from '../../../fixtures/jackpotCityFixture';
import { runHamburgerMenuTests } from '../../../../../common/tests/hamburgerMenu.shared';

const GH_URL = 'https://www.jackpotcity.com.gh/';

test.describe('GH Hamburger Menu Tests', () => {
    runHamburgerMenuTests(test, GH_URL, { excludeTags: ['@T14'] });
});
