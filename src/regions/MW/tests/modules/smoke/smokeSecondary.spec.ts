import { test } from '../../../fixtures/jackpotCityFixture';
import { runSmokeSecondaryNewSuiteTests } from '../../../../../common/tests/smokeSecondaryNewSuite.shared';

test.describe('MW Smoke — Secondary', () => {
    runSmokeSecondaryNewSuiteTests(test);
});
