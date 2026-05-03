import { Bench } from "tinybench";
import { secondsToTimeFormat } from "./index.js";

function nativeFormat(seconds: number, padHours: boolean): string {
  const total = Math.floor(seconds);
  const ss = total % 60;
  const totalMinutes = Math.floor(total / 60);
  const mm = totalMinutes % 60;
  const hh = Math.floor(totalMinutes / 60);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  if (hh === 0) return `${pad(mm)}:${pad(ss)}`;
  const hours = padHours ? pad(hh) : `${hh}`;
  return `${hours}:${pad(mm)}:${pad(ss)}`;
}

const bench = new Bench({ name: "secondsToTimeFormat", time: 1000 });

const cases = [
  { name: "small", seconds: 30 },
  { name: "minutes", seconds: 90 },
  { name: "hours", seconds: 3661 },
  { name: "long", seconds: 90000 },
];

for (const { name, seconds } of cases) {
  bench
    .add(`1o1-utils (${name})`, () => {
      secondsToTimeFormat({ seconds });
    })
    .add(`native (${name})`, () => {
      nativeFormat(seconds, false);
    });
}

export { bench };
