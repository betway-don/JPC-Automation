import { test } from '../../../fixtures/jackpotCityFixture';
import { runSearchNewSuiteTests } from '../../../../../common/tests/searchNewSuite.shared';

test.describe('GH Search Tests', () => {
    runSearchNewSuiteTests(test, '/');
});
