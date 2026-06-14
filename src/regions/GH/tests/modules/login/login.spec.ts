import { test } from '../../../fixtures/jackpotCityFixture';
import { runLoginNewSuiteTests } from '../../../../../common/tests/loginNewSuite.shared';

test.describe('GH Login Tests', () => {
    runLoginNewSuiteTests(test);
});
