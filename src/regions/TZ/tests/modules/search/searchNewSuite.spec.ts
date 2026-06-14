import { test } from '../../../fixtures/jackpotCityFixture';
import { runSearchNewSuiteTests } from '../../../../../common/tests/searchNewSuite.shared';

test.describe('TZ Search Tests', () => {
    runSearchNewSuiteTests(test, '/');
});
