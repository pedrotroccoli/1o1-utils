type OnceFn = <T extends (...args: never[]) => unknown>(fn: T) => T;

export type { OnceFn };
