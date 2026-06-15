/**
 * Generators for well-formed, fake-but-rule-following identity values used during registration.
 * These are NOT real documents — they only need to satisfy the site's *format* validation so a
 * test can complete a passport/ID registration without a real number.
 */

/** Valid leading letters seen on South-African-style passports. */
const PASSPORT_LETTERS = 'ABDMPT';

/**
 * A well-formed passport number: one uppercase letter + 8 digits (e.g. "M58233742").
 * Seeded with the current timestamp tail so every call is unique within a run — this avoids the
 * "already registered" rejection that a purely-random number can hit, while still looking random.
 */
export function generatePassport(): string {
    const letter = PASSPORT_LETTERS[Math.floor(Math.random() * PASSPORT_LETTERS.length)];
    const tail = String(Date.now()).slice(-5);                      // unique-ish, 5 digits
    const rand = String(Math.floor(100 + Math.random() * 900));     // 3 digits
    let digits = tail + rand;                                       // 8 digits total
    if (digits[0] === '0') digits = '1' + digits.slice(1);          // no leading zero
    return letter + digits;
}
