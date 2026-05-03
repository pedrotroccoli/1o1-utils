import type {
  CountryCode,
  IsValidPhoneParams,
  IsValidPhoneResult,
} from "./types.js";

const PHONE_REGEX = /^\+[1-9]\d{0,14}$/;
const SEPARATORS_REGEX = /[\s\-().]/g;

const MAX_INPUT_LENGTH = 32;

const COUNTRIES: Record<CountryCode, readonly [string, ...number[]]> = {
  AC: ["247", 9],
  AD: ["376", 9],
  AE: ["971", 12],
  AF: ["93", 11, 12],
  AG: ["1", 11],
  AI: ["1", 11],
  AL: ["355", 12],
  AM: ["374", 11],
  AO: ["244", 12],
  AR: ["54", 12, 13],
  AS: ["1", 11],
  AT: ["43", 11, 12, 13],
  AU: ["61", 11],
  AW: ["297", 10],
  AX: ["358", 11, 12],
  AZ: ["994", 12],
  BA: ["387", 11],
  BB: ["1", 11],
  BD: ["880", 13],
  BE: ["32", 11],
  BF: ["226", 11],
  BG: ["359", 12],
  BH: ["973", 11],
  BI: ["257", 11],
  BJ: ["229", 11],
  BL: ["590", 12],
  BM: ["1", 11],
  BN: ["673", 10],
  BO: ["591", 11],
  BQ: ["599", 10],
  BR: ["55", 12, 13],
  BS: ["1", 11],
  BT: ["975", 11],
  BW: ["267", 11],
  BY: ["375", 12],
  BZ: ["501", 10],
  CA: ["1", 11],
  CC: ["61", 11],
  CD: ["243", 12],
  CF: ["236", 11],
  CG: ["242", 12],
  CH: ["41", 11],
  CI: ["225", 13],
  CK: ["682", 8],
  CL: ["56", 11],
  CM: ["237", 12],
  CN: ["86", 12, 13],
  CO: ["57", 12],
  CR: ["506", 11],
  CU: ["53", 10, 11],
  CV: ["238", 10],
  CW: ["599", 10],
  CX: ["61", 11],
  CY: ["357", 11],
  CZ: ["420", 12],
  DE: ["49", 11, 12, 13],
  DJ: ["253", 11],
  DK: ["45", 10],
  DM: ["1", 11],
  DO: ["1", 11],
  DZ: ["213", 12],
  EC: ["593", 12],
  EE: ["372", 10, 11],
  EG: ["20", 12],
  EH: ["212", 12],
  ER: ["291", 10],
  ES: ["34", 11],
  ET: ["251", 12],
  FI: ["358", 11, 12],
  FJ: ["679", 10],
  FK: ["500", 8],
  FM: ["691", 10],
  FO: ["298", 9],
  FR: ["33", 11],
  GA: ["241", 11],
  GB: ["44", 12, 13],
  GD: ["1", 11],
  GE: ["995", 12],
  GF: ["594", 12],
  GG: ["44", 12, 13],
  GH: ["233", 12],
  GI: ["350", 11],
  GL: ["299", 9],
  GM: ["220", 10],
  GN: ["224", 12],
  GP: ["590", 12],
  GQ: ["240", 12],
  GR: ["30", 12],
  GT: ["502", 11],
  GU: ["1", 11],
  GW: ["245", 10],
  GY: ["592", 10],
  HK: ["852", 11],
  HN: ["504", 11],
  HR: ["385", 12],
  HT: ["509", 11],
  HU: ["36", 11],
  ID: ["62", 11, 12, 13],
  IE: ["353", 12],
  IL: ["972", 11, 12],
  IM: ["44", 12, 13],
  IN: ["91", 12],
  IO: ["246", 10],
  IQ: ["964", 13],
  IR: ["98", 12],
  IS: ["354", 10],
  IT: ["39", 11, 12],
  JE: ["44", 12, 13],
  JM: ["1", 11],
  JO: ["962", 12],
  JP: ["81", 11, 12],
  KE: ["254", 12],
  KG: ["996", 12],
  KH: ["855", 11, 12],
  KI: ["686", 8],
  KM: ["269", 10],
  KN: ["1", 11],
  KP: ["850", 12],
  KR: ["82", 11, 12],
  KW: ["965", 11],
  KY: ["1", 11],
  KZ: ["7", 11],
  LA: ["856", 11, 12],
  LB: ["961", 11],
  LC: ["1", 11],
  LI: ["423", 10],
  LK: ["94", 11],
  LR: ["231", 11, 12],
  LS: ["266", 11],
  LT: ["370", 11],
  LU: ["352", 11],
  LV: ["371", 11],
  LY: ["218", 12],
  MA: ["212", 12],
  MC: ["377", 11, 12],
  MD: ["373", 11],
  ME: ["382", 11],
  MF: ["590", 12],
  MG: ["261", 12],
  MH: ["692", 10],
  MK: ["389", 11],
  ML: ["223", 11],
  MM: ["95", 11, 12],
  MN: ["976", 11],
  MO: ["853", 11],
  MP: ["1", 11],
  MQ: ["596", 12],
  MR: ["222", 11],
  MS: ["1", 11],
  MT: ["356", 11],
  MU: ["230", 10],
  MV: ["960", 10],
  MW: ["265", 12],
  MX: ["52", 12, 13],
  MY: ["60", 11, 12],
  MZ: ["258", 12],
  NA: ["264", 12],
  NC: ["687", 9],
  NE: ["227", 11],
  NF: ["672", 8],
  NG: ["234", 13],
  NI: ["505", 11],
  NL: ["31", 11],
  NO: ["47", 10],
  NP: ["977", 13],
  NR: ["674", 10],
  NU: ["683", 7],
  NZ: ["64", 11, 12],
  OM: ["968", 11],
  PA: ["507", 11],
  PE: ["51", 11],
  PF: ["689", 9],
  PG: ["675", 11],
  PH: ["63", 12],
  PK: ["92", 12],
  PL: ["48", 11],
  PM: ["508", 9],
  PR: ["1", 11],
  PS: ["970", 12],
  PT: ["351", 12],
  PW: ["680", 10],
  PY: ["595", 12],
  QA: ["974", 11],
  RE: ["262", 12],
  RO: ["40", 11],
  RS: ["381", 12],
  RU: ["7", 11],
  RW: ["250", 12],
  SA: ["966", 12],
  SB: ["677", 8],
  SC: ["248", 10],
  SD: ["249", 12],
  SE: ["46", 11],
  SG: ["65", 10],
  SH: ["290", 8],
  SI: ["386", 11],
  SJ: ["47", 10],
  SK: ["421", 12],
  SL: ["232", 11],
  SM: ["378", 11],
  SN: ["221", 12],
  SO: ["252", 11, 12],
  SR: ["597", 10],
  SS: ["211", 12],
  ST: ["239", 10],
  SV: ["503", 11],
  SX: ["1", 11],
  SY: ["963", 12],
  SZ: ["268", 11],
  TC: ["1", 11],
  TD: ["235", 11],
  TG: ["228", 11],
  TH: ["66", 11],
  TJ: ["992", 12],
  TK: ["690", 7],
  TL: ["670", 10],
  TM: ["993", 11],
  TN: ["216", 11],
  TO: ["676", 8],
  TR: ["90", 12],
  TT: ["1", 11],
  TV: ["688", 8],
  TW: ["886", 12],
  TZ: ["255", 12],
  UA: ["380", 12],
  UG: ["256", 12],
  US: ["1", 11],
  UY: ["598", 11],
  UZ: ["998", 12],
  VA: ["379", 12],
  VC: ["1", 11],
  VE: ["58", 12],
  VG: ["1", 11],
  VI: ["1", 11],
  VN: ["84", 11, 12],
  VU: ["678", 8],
  WF: ["681", 8],
  WS: ["685", 8],
  XK: ["383", 11],
  YE: ["967", 12],
  YT: ["262", 12],
  ZA: ["27", 11],
  ZM: ["260", 12],
  ZW: ["263", 12],
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
 * `country`, only generic E.164 structure is checked. All ISO 3166-1
 * alpha-2 codes with an assigned ITU-T E.164 country code are supported
 * (~240 territories).
 *
 * @param params - The parameters object
 * @param params.phone - The value to validate
 * @param params.country - Optional ISO 3166-1 alpha-2 country code. When
 *   set, the number must use that country's dialing prefix and total
 *   digit length. Default: generic E.164 only.
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
 * Country validation checks the dialing prefix and total digit count only
 * — it does not distinguish mobile vs fixed-line, nor verify area codes.
 * Countries that share a dialing prefix cannot be distinguished: a
 * `country: "CA"` check accepts US numbers and vice-versa (NANP, +1);
 * `country: "RU"` accepts numbers from any other +7 country (e.g.
 * Kazakhstan). For carrier-grade validation, use a library backed by
 * phone metadata (e.g. libphonenumber-js).
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
