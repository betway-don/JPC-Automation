import { test } from '../../../fixtures/jackpotCityFixture';
import { runLoginTests } from '../../../../../common/tests/login.shared';

const GH_URL = 'https://www.jackpotcity.com.gh/';

test.describe('GH Login Tests', () => {
    runLoginTests(test, GH_URL);
});
