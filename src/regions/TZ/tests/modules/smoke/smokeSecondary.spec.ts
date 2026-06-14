import { test } from '../../../fixtures/jackpotCityFixture';
import { runSmokeSecondaryNewSuiteTests } from '../../../../../common/tests/smokeSecondaryNewSuite.shared';

test.describe('TZ Smoke — Secondary', () => {
    runSmokeSecondaryNewSuiteTests(test);
});
