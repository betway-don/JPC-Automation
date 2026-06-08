import { test } from '../../../fixtures/jackpotCityFixture';
import { runSearchNewSuiteTests } from '../../../../../common/tests/searchNewSuite.shared';

test.describe('Game Search Test Cases', () => {
    runSearchNewSuiteTests(test, '/');
});
