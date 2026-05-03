import type {
  CountryCode,
  IsValidPhoneParams,
  IsValidPhoneResult,
} from "./types.js";

const PHONE_REGEX = /^\+[1-9]\d{0,14}$/;
const SEPARATORS_REGEX = /[\s\-().]/g;

const MAX_INPUT_LENGTH = 32;

const COUNTRIES: Record<CountryCode, readonly [string, ...number[]]> = {
  AE: ["971", 12],
  AR: ["54", 12, 13],
  AT: ["43", 11, 12, 13],
  AU: ["61", 11],
  BE: ["32", 11],
  BR: ["55", 12, 13],
  CA: ["1", 11],
  CH: ["41", 11],
  CL: ["56", 11],
  CN: ["86", 12, 13],
  CO: ["57", 12],
  DE: ["49", 11, 12, 13],
  DK: ["45", 10],
  EC: ["593", 12],
  EG: ["20", 12],
  ES: ["34", 11],
  FI: ["358", 11, 12],
  FR: ["33", 11],
  GB: ["44", 12, 13],
  HK: ["852", 11],
  ID: ["62", 11, 12, 13],
  IE: ["353", 12],
  IL: ["972", 11, 12],
  IN: ["91", 12],
  IT: ["39", 11, 12],
  JP: ["81", 11, 12],
  KE: ["254", 12],
  KR: ["82", 11, 12],
  MX: ["52", 12, 13],
  MY: ["60", 11, 12],
  NG: ["234", 13],
  NL: ["31", 11],
  NO: ["47", 10],
  NZ: ["64", 11, 12],
  PE: ["51", 11],
  PH: ["63", 12],
  PL: ["48", 11],
  PT: ["351", 12],
  RU: ["7", 11],
  SA: ["966", 12],
  SE: ["46", 11],
  SG: ["65", 10],
  TH: ["66", 11],
  TR: ["90", 12],
  US: ["1", 11],
  UY: ["598", 11],
  VE: ["58", 12],
  VN: ["84", 11, 12],
  ZA: ["27", 11],
};

/**
 * Checks whether a string is a well-formed E.164 international phone number.
 *
 * Requires a leading `+`, a non-zero country code, and 1–15 total digits
 * (E.164 maximum). Common readability separators — spaces, hyphens,
 * parentheses, and dots — are stripped before validation. Any other
 * character causes rejection.
 *
 * Pass `country` (ISO 3166-1 alpha-2) to additionally enforce the dialing
 * prefix and expected total digit length for that country. Without
 * `country`, only generic E.164 structure is checked.
 *
 * @param params - The parameters object
 * @param params.phone - The value to validate
 * @param params.country - Optional ISO 3166-1 alpha-2 country code. When
 *   set, the number must use that country's dialing prefix and total
 *   digit length. ~50 popular countries supported. Default: generic E.164
 *   only.
 * @returns `true` if the value is a parseable E.164 phone number, `false` otherwise
 *
 * @example
 * ```ts
 * isValidPhone({ phone: "+5511999999999" });                  // => true
 * isValidPhone({ phone: "+1 555 1234567" });                  // => true
 * isValidPhone({ phone: "+44 (20) 7946-0958" });              // => true
 *
 * isValidPhone({ phone: "11999999999" });                     // => false (no country code)
 * isValidPhone({ phone: "+0123456789" });                     // => false (country code starts with 0)
 * isValidPhone({ phone: "abc" });                             // => false
 *
 * // Country-scoped validation
 * isValidPhone({ phone: "+5511999999999", country: "BR" });   // => true
 * isValidPhone({ phone: "+15551234567", country: "BR" });     // => false (US number, not BR)
 * isValidPhone({ phone: "+5511999", country: "BR" });         // => false (too short for BR)
 * isValidPhone({ phone: "+15551234567", country: "US" });     // => true
 * ```
 *
 * @keywords phone, validate phone, is phone, valid phone, phone number, e164, international, country
 *
 * @remarks
 * Non-string inputs (including `null`, `undefined`, numbers, and objects)
 * always return `false`. Empty strings return `false` without invoking the
 * regex.
 *
 * Inputs longer than 32 characters are rejected immediately to avoid
 * unbounded regex work on pathological input.
 *
 * Country support is intentionally limited to ~50 popular countries to
 * keep the bundle small. The supported set: AE, AR, AT, AU, BE, BR, CA,
 * CH, CL, CN, CO, DE, DK, EC, EG, ES, FI, FR, GB, HK, ID, IE, IL, IN, IT,
 * JP, KE, KR, MX, MY, NG, NL, NO, NZ, PE, PH, PL, PT, RU, SA, SE, SG, TH,
 * TR, US, UY, VE, VN, ZA. Passing a `country` outside this set returns
 * `false`.
 *
 * Country validation checks the dialing prefix and total digit count only
 * — it does not distinguish mobile vs fixed-line, nor verify area codes.
 * For carrier-grade validation, use a library backed by phone metadata
 * (e.g. libphonenumber-js).
 */
function isValidPhone({
  phone,
  country,
}: IsValidPhoneParams): IsValidPhoneResult {
  if (typeof phone !== "string") return false;
  if (phone.length === 0 || phone.length > MAX_INPUT_LENGTH) return false;

  const stripped = phone.replace(SEPARATORS_REGEX, "");
  if (!PHONE_REGEX.test(stripped)) return false;

  if (country === undefined) return true;

  const entry = COUNTRIES[country];
  if (entry === undefined) return false;

  const [dialCode, ...lengths] = entry;
  const digits = stripped.slice(1);
  if (!digits.startsWith(dialCode)) return false;

  return lengths.includes(stripped.length - 1);
}

export { isValidPhone };
