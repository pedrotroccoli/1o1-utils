const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function isUnsafeKey(key: string): boolean {
  return UNSAFE_KEYS.has(key);
}

export { isUnsafeKey, UNSAFE_KEYS };
