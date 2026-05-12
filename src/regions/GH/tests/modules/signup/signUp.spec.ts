import { test } from '../../../fixtures/jackpotCityFixture';
import { runSignupTests } from '../../../../../common/tests/signup.shared';

test.describe('GH Signup Tests', () => {
    runSignupTests(test, '/', {
        excludeTags: [
            // ZA-only: Name fields (not present in GH form)
            'T26', 'T27', 'T28', 'T29', 'T30', 'T31', 'T32',
            // ZA-only: Step 2 - ID/Passport verification
            'T33', 'T34', 'T35', 'T36', 'T37',
            // TZ-only: Preferred language, Referral code, Agree-to-All checkbox
            'T38', 'T39', 'T40', 'T41', 'T42',
        ]
    });
});
