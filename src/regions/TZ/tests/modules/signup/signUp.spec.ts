import { test } from '../../../fixtures/jackpotCityFixture';
import { runSignupTests } from '../../../../../common/tests/signup.shared';

test.describe('TZ Signup Tests', () => {
    runSignupTests(test, '/', {
        excludeTags: [
            // TZ-only: extra password checks excluded
            'T15', 'T16', 'T17', 'T20', 'T21', 'T22',
            // ZA-only: Name fields (not present in TZ form)
            'T26', 'T27', 'T28', 'T29', 'T30', 'T31', 'T32',
            // ZA-only: Step 2 - ID/Passport verification
            'T33', 'T34', 'T35', 'T36', 'T37',
            // GH-only: Confirm Password field
            'T24', 'T25',
            // GH-only: Date of Birth picker
            'T43',
        ]
    });
});
