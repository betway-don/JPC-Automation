import { test } from '../../../fixtures/jackpotCityFixture';
import { runLoginTests } from '../../../../../common/tests/login.shared';

test.describe('GH Login Tests', () => {
    runLoginTests(test, '/');
});
