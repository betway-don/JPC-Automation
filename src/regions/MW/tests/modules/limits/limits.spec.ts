import { test } from '../../../fixtures/jackpotCityFixture';
import { runLimitsTests } from '../../../../../common/tests/limits.shared';

test.describe('MW Limits Tests', () => {
    runLimitsTests(test);
});
