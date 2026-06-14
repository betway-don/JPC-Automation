import { test } from '../../../fixtures/jackpotCityFixture';
import { runSmokePriorityNewSuiteTests } from '../../../../../common/tests/smokePriorityNewSuite.shared';

test.describe('TZ Smoke — Priority', () => {
    runSmokePriorityNewSuiteTests(test);
});
