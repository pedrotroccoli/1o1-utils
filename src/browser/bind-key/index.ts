import type { BindKeyHandler, BindKeyOptions, ParsedStep } from "./types.js";

const MODIFIERS = new Set(["ctrl", "shift", "alt", "meta", "cmd", "mod"]);

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
      step.key = part;
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

function eventMatches(event: KeyboardEvent, step: ParsedStep): boolean {
  return (
    event.key.toLowerCase() === step.key &&
    event.ctrlKey === step.ctrl &&
    event.shiftKey === step.shift &&
    event.altKey === step.alt &&
    event.metaKey === step.meta
  );
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
 * Combo grammar: `+` joins simultaneous modifiers (e.g. `ctrl+shift+p`),
 * spaces separate sequence steps (e.g. `g i`). Modifiers: `ctrl`, `shift`,
 * `alt`, `meta` (alias `cmd`), and `mod` (= `meta` on Mac, `ctrl` elsewhere).
 * Key names match `KeyboardEvent.key` lowercased — use `"arrowleft"`,
 * `"escape"`, `"enter"`, `" "` (space), `"f1"`, etc. for non-printable keys.
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
 * @returns Idempotent unbind function.
 *
 * @example
 * ```ts
 * const unbind = bindKey("ctrl+k", () => openSearch());
 * bindKey("g i", () => goToInbox());
 * bindKey("escape", () => closeModal());
 * bindKey("ctrl+arrowleft", () => prevTab());
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
  const filterInputs = options.filterInputs !== false;
  const sequenceTimeout = options.sequenceTimeout ?? 1000;
  const preventDefault = options.preventDefault === true;
  const bypassFilter = steps.some(hasNonShiftModifier);

  const target =
    options.target ??
    (typeof window !== "undefined" ? (window as EventTarget) : undefined);
  if (target === undefined) {
    throw new Error(
      "bindKey requires a 'target' option in non-browser environments",
    );
  }

  let cursor = 0;
  let lastTime = 0;

  const listener = (event: Event): void => {
    const ke = event as KeyboardEvent;
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
        if (eventMatches(ke, steps[0] as ParsedStep)) {
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
