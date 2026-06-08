import { test } from '../../../fixtures/jackpotCityFixture';
import { runHeaderNewSuiteTests } from '../../../../../common/tests/headerNewSuite.shared';

test.describe('Header Test Cases', () => {
    runHeaderNewSuiteTests(test, '/');
});
