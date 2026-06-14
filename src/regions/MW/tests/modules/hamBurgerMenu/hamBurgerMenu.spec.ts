import { test } from '../../../fixtures/jackpotCityFixture';
import { runHamburgerMenuNewSuiteTests } from '../../../../../common/tests/hamburgerMenuNewSuite.shared';

test.describe('MW Hamburger Menu Tests', () => {
    runHamburgerMenuNewSuiteTests(test, '/');
});
