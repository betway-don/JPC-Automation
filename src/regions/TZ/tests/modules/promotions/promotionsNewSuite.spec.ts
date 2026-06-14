import { test } from '../../../fixtures/jackpotCityFixture';
import { runPromotionsNewSuiteTests } from '../../../../../common/tests/promotionsNewSuite.shared';

test.describe('TZ Promotions Tests', () => {
    runPromotionsNewSuiteTests(test, '/');
});
