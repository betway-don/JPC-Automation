import { test } from '../../../fixtures/jackpotCityFixture';
import { runHeaderNewSuiteTests } from '../../../../../common/tests/headerNewSuite.shared';

test.describe('MW Header Tests', () => {
    runHeaderNewSuiteTests(test, '/');
});
