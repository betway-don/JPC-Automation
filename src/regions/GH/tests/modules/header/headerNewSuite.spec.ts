import { test } from '../../../fixtures/jackpotCityFixture';
import { runHeaderNewSuiteTests } from '../../../../../common/tests/headerNewSuite.shared';

test.describe('GH Header Tests', () => {
    runHeaderNewSuiteTests(test, '/');
});
