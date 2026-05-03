import type { BindKeyHandler, BindKeyOptions, ParsedStep } from "./types.js";

const MODIFIERS = new Set(["ctrl", "shift", "alt", "meta", "cmd", "mod"]);

const KEY_ALIASES: Record<string, string> = {
  space: " ",
  spacebar: " ",
  esc: "escape",
  return: "enter",
  del: "delete",
  ins: "insert",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
};

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const platform =
    (navigator as { userAgentData?: { platform?: string } }).userAgentData
      ?.platform ??
    navigator.platform ??
    navigator.userAgent;
  return /mac|iphone|ipad|ipod/i.test(platform);
}

function parseStep(raw: string, mac: boolean): ParsedStep {
  const parts = raw.split("+").map((p) => p.trim().toLowerCase());
  if (parts.length === 0 || parts.some((p) => p === "")) {
    throw new Error(`Invalid key combo: "${raw}"`);
  }

  const step: ParsedStep = {
    key: "",
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
  };

  for (const part of parts) {
    if (MODIFIERS.has(part)) {
      if (part === "ctrl") step.ctrl = true;
      else if (part === "shift") step.shift = true;
      else if (part === "alt") step.alt = true;
      else if (part === "meta" || part === "cmd") step.meta = true;
      else if (part === "mod") {
        if (mac) step.meta = true;
        else step.ctrl = true;
      }
    } else {
      if (step.key !== "") {
        throw new Error(
          `Invalid key combo: "${raw}" — multiple non-modifier keys`,
        );
      }
      step.key = KEY_ALIASES[part] ?? part;
    }
  }

  if (step.key === "") {
    throw new Error(`Invalid key combo: "${raw}" — missing key`);
  }

  return step;
}

function parseCombo(combo: string): ParsedStep[] {
  if (typeof combo !== "string" || combo.trim() === "") {
    throw new Error("The 'combo' parameter must be a non-empty string");
  }
  const mac = isMac();
  return combo
    .trim()
    .split(/\s+/)
    .map((step) => parseStep(step, mac));
}

function codeKey(code: string): string {
  if (code.startsWith("Key")) return code.slice(3).toLowerCase();
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("Numpad")) return code.slice(6).toLowerCase();
  return code.toLowerCase();
}

function eventMatches(event: KeyboardEvent, step: ParsedStep): boolean {
  if (
    event.ctrlKey !== step.ctrl ||
    event.shiftKey !== step.shift ||
    event.altKey !== step.alt ||
    event.metaKey !== step.meta
  ) {
    return false;
  }
  const key = event.key.toLowerCase();
  if (key === step.key) return true;
  return event.code !== undefined && codeKey(event.code) === step.key;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (target === null) return false;
  const el = target as Partial<HTMLElement> & {
    tagName?: string;
    isContentEditable?: boolean;
  };
  if (el.isContentEditable === true) return true;
  const tag = typeof el.tagName === "string" ? el.tagName.toUpperCase() : "";
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function hasNonShiftModifier(step: ParsedStep): boolean {
  return step.ctrl || step.alt || step.meta;
}

function now(): number {
  return typeof performance !== "undefined" &&
    typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

/**
 * Binds a keyboard shortcut to a handler. Returns a cleanup function that
 * removes the listener.
 *
 * Combo grammar:
 * - `+` joins one or more modifiers with a single key into one
 *   simultaneous step (e.g. `ctrl+shift+p`). Each `+`-joined step must
 *   contain at most one non-modifier key — `g+i` throws because both
 *   are keys, not modifiers. Modifier-only steps (e.g. just `ctrl`)
 *   also throw.
 * - Spaces separate sequence steps pressed in order (e.g. `g i` =
 *   press `g`, then `i`). Steps may themselves use `+`, so
 *   `ctrl+k ctrl+t` is a two-step sequence of modifier combos.
 *
 * Modifiers: `ctrl`, `shift`, `alt`, `meta` (alias `cmd`), and `mod`
 * (= `meta` on Mac, `ctrl` elsewhere).
 *
 * Key names match `KeyboardEvent.key` lowercased. Aliases: `space`,
 * `esc`, `return`, `del`, `ins`, `up`, `down`, `left`, `right`. Use
 * full names like `arrowleft`, `escape`, `enter`, `f1` if preferred.
 *
 * Shift+digit and shift+letter combos compare against `event.code`
 * (`Digit1`, `KeyA`) when `event.key` doesn't match, so `shift+1`
 * fires regardless of the OS-level shifted symbol (`!`, `@`, etc.).
 *
 * @param combo - Key combo string. Case-insensitive.
 * @param handler - Called with the final `KeyboardEvent` on a match.
 * @param options - Optional configuration.
 * @param options.target - Event target to attach to. Defaults to `window`.
 * @param options.filterInputs - When true (default), the handler is skipped
 *   while focus is on `INPUT`, `TEXTAREA`, `SELECT`, or a `contenteditable`
 *   element. Combos with any non-shift modifier (`ctrl`, `alt`, `meta`,
 *   `cmd`, `mod`) bypass the filter and always fire — including sequences
 *   where only one step carries a modifier.
 * @param options.sequenceTimeout - Idle ms after which a sequence buffer
 *   resets. Defaults to `1000`.
 * @param options.preventDefault - When true, calls `event.preventDefault()`
 *   on a full match. Defaults to `false`.
 * @param options.ignoreRepeat - When true (default), auto-repeat events
 *   (`event.repeat === true`) are ignored, so the handler fires once per
 *   physical keypress. Set to `false` to fire on every repeat.
 * @returns Idempotent unbind function.
 *
 * @example
 * ```ts
 * const unbind = bindKey("ctrl+k", () => openSearch());
 * bindKey("g i", () => goToInbox());
 * bindKey("escape", () => closeModal());
 * bindKey("ctrl+arrowleft", () => prevTab());
 * bindKey("space", () => togglePlay());
 * unbind();
 * ```
 *
 * @keywords keyboard shortcut, hotkey, key binding, keypress, keymap, accelerator, shortcut
 *
 * @throws Error if `combo` is empty or malformed, if `handler` is not a
 *   function, or if no `target` is provided in a non-browser environment.
 *
 * @remarks Browser-only utility. Does not work in Node/SSR unless an
 *   explicit `target` (any `EventTarget`) is provided.
 */
function bindKey(
  combo: string,
  handler: BindKeyHandler,
  options: BindKeyOptions = {},
): () => void {
  if (typeof handler !== "function") {
    throw new Error("The 'handler' parameter must be a function");
  }

  const steps = parseCombo(combo);
  const firstStep = steps[0] as ParsedStep;
  const filterInputs = options.filterInputs !== false;
  const sequenceTimeout = options.sequenceTimeout ?? 1000;
  const preventDefault = options.preventDefault === true;
  const ignoreRepeat = options.ignoreRepeat !== false;
  const bypassFilter = steps.some(hasNonShiftModifier);

  const target =
    options.target ?? (typeof window !== "undefined" ? window : undefined);
  if (target === undefined) {
    throw new Error(
      "bindKey requires a 'target' option in non-browser environments",
    );
  }

  let cursor = 0;
  let lastTime = 0;

  const listener = (event: Event): void => {
    const ke = event as KeyboardEvent;
    if (ignoreRepeat && ke.repeat) return;

    const t = now();
    if (cursor > 0 && t - lastTime > sequenceTimeout) {
      cursor = 0;
    }

    if (filterInputs && !bypassFilter && isEditableTarget(ke.target)) {
      return;
    }

    const step = steps[cursor];
    if (step === undefined) return;

    if (!eventMatches(ke, step)) {
      if (cursor > 0) {
        cursor = 0;
        if (eventMatches(ke, firstStep)) {
          cursor = 1;
          lastTime = t;
        }
      }
      return;
    }

    cursor += 1;
    lastTime = t;

    if (cursor === steps.length) {
      cursor = 0;
      if (preventDefault) ke.preventDefault();
      handler(ke);
    }
  };

  target.addEventListener("keydown", listener);

  let bound = true;
  return () => {
    if (!bound) return;
    bound = false;
    target.removeEventListener("keydown", listener);
  };
}

export { bindKey };
