import { test } from '../../../fixtures/jackpotCityFixture';
import { runSearchNewSuiteTests } from '../../../../../common/tests/searchNewSuite.shared';

test.describe('MW Search Tests', () => {
    runSearchNewSuiteTests(test, '/');
});
