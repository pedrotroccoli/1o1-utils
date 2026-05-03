import type {
  SecondsToTimeFormatParams,
  SecondsToTimeFormatResult,
} from "./types.js";

/**
 * Converts a non-negative number of seconds to a zero-padded time-format string.
 * Uses `MM:SS` when under one hour and `H:MM:SS` (or `HH:MM:SS` with `padHours`)
 * otherwise. Hours are not capped at 24.
 *
 * @param params - The parameters object
 * @param params.seconds - Total seconds to format (non-negative; floored if not integer)
 * @param params.padHours - Zero-pad the hours to two digits when present (default `false`)
 * @returns The formatted time string
 *
 * @example
 * ```ts
 * secondsToTimeFormat({ seconds: 90 });                    // "01:30"
 * secondsToTimeFormat({ seconds: 3661 });                  // "1:01:01"
 * secondsToTimeFormat({ seconds: 3661, padHours: true });  // "01:01:01"
 * ```
 *
 * @keywords format seconds, hh:mm:ss, mm:ss, time format, duration, clock, pad time
 *
 * @throws Error if `seconds` is not a finite non-negative number
 */
function secondsToTimeFormat({
  seconds,
  padHours = false,
}: SecondsToTimeFormatParams): SecondsToTimeFormatResult {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    throw new Error("The 'seconds' parameter must be a finite number");
  }
  if (seconds < 0) {
    throw new Error("The 'seconds' parameter must be non-negative");
  }

  const total = Math.floor(seconds);
  const ss = total % 60;
  const totalMinutes = Math.floor(total / 60);
  const mm = totalMinutes % 60;
  const hh = Math.floor(totalMinutes / 60);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  if (hh === 0) {
    return `${pad(mm)}:${pad(ss)}`;
  }
  const hours = padHours ? pad(hh) : `${hh}`;
  return `${hours}:${pad(mm)}:${pad(ss)}`;
}

export { secondsToTimeFormat };
