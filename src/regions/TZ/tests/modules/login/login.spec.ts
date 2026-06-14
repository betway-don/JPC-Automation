import { test } from '../../../fixtures/jackpotCityFixture';
import { runLoginNewSuiteTests } from '../../../../../common/tests/loginNewSuite.shared';

test.describe('TZ Login Tests', () => {
    runLoginNewSuiteTests(test);
});
