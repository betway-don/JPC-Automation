import { test } from '../../../fixtures/jackpotCityFixture';
import { runLimitsTests } from '../../../../../common/tests/limits.shared';

test.describe('GH Limits Tests', () => {
    runLimitsTests(test);
});
