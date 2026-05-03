import type {
  TimeFormatToSecondsParams,
  TimeFormatToSecondsResult,
} from "./types.js";

const TIME_PATTERN = /^\d+(?::\d+){1,2}$/;

/**
 * Parses a time-format string (`MM:SS` or `[H]H:MM:SS`) into a total number of seconds.
 * Inverse of `secondsToTimeFormat`. Hours are not capped; minutes and seconds must be
 * in `0..59`.
 *
 * @param params - The parameters object
 * @param params.time - Time string in `MM:SS` or `H:MM:SS` / `HH:MM:SS` form
 * @returns The total number of seconds
 *
 * @example
 * ```ts
 * timeFormatToSeconds({ time: "01:30" });    // 90
 * timeFormatToSeconds({ time: "1:01:01" });  // 3661
 * timeFormatToSeconds({ time: "01:01:01" }); // 3661
 * ```
 *
 * @keywords parse time, hh:mm:ss to seconds, mm:ss to seconds, duration parse, time to seconds
 *
 * @throws Error if `time` is not a string, is malformed, or has out-of-range minutes/seconds
 */
function timeFormatToSeconds({
  time,
}: TimeFormatToSecondsParams): TimeFormatToSecondsResult {
  if (typeof time !== "string") {
    throw new Error("The 'time' parameter must be a string");
  }
  if (!TIME_PATTERN.test(time)) {
    throw new Error(
      "The 'time' parameter must match 'MM:SS' or 'HH:MM:SS' format",
    );
  }

  const parts = time.split(":").map((p) => Number.parseInt(p, 10));

  if (parts.length === 2) {
    const [mm, ss] = parts;
    if (mm > 59) {
      throw new Error(
        "Minutes must be 0-59 in 'MM:SS' format; use 'HH:MM:SS' for longer durations",
      );
    }
    if (ss > 59) {
      throw new Error("Seconds must be 0-59");
    }
    return mm * 60 + ss;
  }

  const [hh, mm, ss] = parts;
  if (mm > 59) {
    throw new Error("Minutes must be 0-59");
  }
  if (ss > 59) {
    throw new Error("Seconds must be 0-59");
  }
  return hh * 3600 + mm * 60 + ss;
}

export { timeFormatToSeconds };
