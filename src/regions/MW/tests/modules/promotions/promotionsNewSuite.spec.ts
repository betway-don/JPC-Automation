import { test } from '../../../fixtures/jackpotCityFixture';
import { runPromotionsNewSuiteTests } from '../../../../../common/tests/promotionsNewSuite.shared';

test.describe('MW Promotions Tests', () => {
    runPromotionsNewSuiteTests(test, '/');
});
