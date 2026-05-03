interface BindKeyOptions {
  target?: EventTarget;
  filterInputs?: boolean;
  sequenceTimeout?: number;
  preventDefault?: boolean;
  ignoreRepeat?: boolean;
}

type BindKeyHandler = (event: KeyboardEvent) => void;

type BindKey = (
  combo: string,
  handler: BindKeyHandler,
  options?: BindKeyOptions,
) => () => void;

interface ParsedStep {
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
}

export type { BindKey, BindKeyHandler, BindKeyOptions, ParsedStep };
