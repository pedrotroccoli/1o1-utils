import { Bench } from "tinybench";
import { timeFormatToSeconds } from "./index.js";

function nativeParse(time: string): number {
  const parts = time.split(":").map((p) => Number.parseInt(p, 10));
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

const bench = new Bench({ name: "timeFormatToSeconds", time: 1000 });

const cases = [
  { name: "mm-ss", time: "00:30" },
  { name: "minutes", time: "01:30" },
  { name: "hours", time: "1:01:01" },
  { name: "long", time: "100:00:00" },
];

for (const { name, time } of cases) {
  bench
    .add(`1o1-utils (${name})`, () => {
      timeFormatToSeconds({ time });
    })
    .add(`native (${name})`, () => {
      nativeParse(time);
    });
}

export { bench };
