import { Bench } from "tinybench";
import { stringStrength } from "./index.js";

function nativeStringStrength(str: string): {
  entropy: number;
  effectiveEntropy: number;
} {
  const codePoints = [...str];
  const length = codePoints.length;
  if (length === 0) return { entropy: 0, effectiveEntropy: 0 };

  const freq: Record<string, number> = {};
  for (const ch of codePoints) {
    freq[ch] = (freq[ch] ?? 0) + 1;
  }

  let entropy = 0;
  for (const key in freq) {
    const p = freq[key] / length;
    entropy -= p * Math.log2(p);
  }

  return { entropy, effectiveEntropy: entropy * length };
}

const shortPwd = "Tr0ub4dor&3";
const passphrase = "correct-horse-battery-staple-and-some-more-words-here";
const allSame = "a".repeat(64);
const unicodeHeavy = "你好世界café🙂".repeat(4);

const bench = new Bench({ name: "stringStrength", time: 1000 });

bench
  .add("1o1-utils (short password)", () => {
    stringStrength({ str: shortPwd });
  })
  .add("native (short password)", () => {
    nativeStringStrength(shortPwd);
  });

bench
  .add("1o1-utils (passphrase)", () => {
    stringStrength({ str: passphrase });
  })
  .add("native (passphrase)", () => {
    nativeStringStrength(passphrase);
  });

bench
  .add("1o1-utils (all-same 64)", () => {
    stringStrength({ str: allSame });
  })
  .add("native (all-same 64)", () => {
    nativeStringStrength(allSame);
  });

bench
  .add("1o1-utils (unicode-heavy)", () => {
    stringStrength({ str: unicodeHeavy });
  })
  .add("native (unicode-heavy)", () => {
    nativeStringStrength(unicodeHeavy);
  });

export { bench };
