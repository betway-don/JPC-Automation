import { test } from '../../../fixtures/jackpotCityFixture';
import { runHeaderNewSuiteTests } from '../../../../../common/tests/headerNewSuite.shared';

test.describe('TZ Header Tests', () => {
    runHeaderNewSuiteTests(test, '/');
});
