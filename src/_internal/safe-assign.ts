function safeAssign(
  tgt: Record<string, unknown>,
  key: string,
  value: unknown,
): void {
  Object.defineProperty(tgt, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

export { safeAssign };
