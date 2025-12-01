import { test } from '../../../fixtures/jackpotCityFixture';
import { runLoginTests } from '../../../../../common/tests/login.shared';

test.describe('Login Page Test Cases', () => {
    runLoginTests(
        test,
        'https://www.jackpotcity.co.tz/'
    );
});
