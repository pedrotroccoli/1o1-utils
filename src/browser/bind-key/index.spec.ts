import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { bindKey } from "./index.js";

interface DispatchOptions {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  code?: string;
  repeat?: boolean;
  target?: EventTarget;
}

function press(
  on: EventTarget,
  key: string,
  opts: DispatchOptions = {},
): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    key,
    code: opts.code,
    ctrlKey: opts.ctrl ?? false,
    shiftKey: opts.shift ?? false,
    altKey: opts.alt ?? false,
    metaKey: opts.meta ?? false,
    repeat: opts.repeat ?? false,
    bubbles: true,
    cancelable: true,
  });
  if (opts.target !== undefined) {
    Object.defineProperty(event, "target", { value: opts.target });
  }
  on.dispatchEvent(event);
  return event;
}

describe("bindKey", () => {
  let target: EventTarget;

  beforeEach(() => {
    target = new EventTarget();
  });

  it("fires on a single-key match", () => {
    let count = 0;
    bindKey("k", () => count++, { target });
    press(target, "k");
    expect(count).to.equal(1);
  });

  it("ignores non-matching keys", () => {
    let count = 0;
    bindKey("k", () => count++, { target });
    press(target, "j");
    expect(count).to.equal(0);
  });

  it("matches a modifier combo", () => {
    let count = 0;
    bindKey("ctrl+k", () => count++, { target });
    press(target, "k", { ctrl: true });
    expect(count).to.equal(1);
  });

  it("ignores combo when modifier missing", () => {
    let count = 0;
    bindKey("ctrl+k", () => count++, { target });
    press(target, "k");
    expect(count).to.equal(0);
  });

  it("matches multi-modifier combo", () => {
    let count = 0;
    bindKey("ctrl+shift+p", () => count++, { target });
    press(target, "p", { ctrl: true, shift: true });
    expect(count).to.equal(1);
    press(target, "p", { ctrl: true });
    expect(count).to.equal(1);
  });

  it("matches a key sequence", () => {
    let count = 0;
    bindKey("g i", () => count++, { target });
    press(target, "g");
    press(target, "i");
    expect(count).to.equal(1);
  });

  it("does not fire on partial sequence", () => {
    let count = 0;
    bindKey("g i", () => count++, { target });
    press(target, "g");
    expect(count).to.equal(0);
  });

  it("resets sequence on mismatch", () => {
    let count = 0;
    bindKey("g i", () => count++, { target });
    press(target, "g");
    press(target, "x");
    press(target, "i");
    expect(count).to.equal(0);
  });

  it("treats interrupting first-step key as new sequence start", () => {
    let count = 0;
    bindKey("g i", () => count++, { target });
    press(target, "g");
    press(target, "g");
    press(target, "i");
    expect(count).to.equal(1);
  });

  it("resets sequence after timeout", async () => {
    let count = 0;
    bindKey("g i", () => count++, { target, sequenceTimeout: 10 });
    press(target, "g");
    await new Promise((r) => setTimeout(r, 25));
    press(target, "i");
    expect(count).to.equal(0);
  });

  it("unbind stops the handler", () => {
    let count = 0;
    const unbind = bindKey("k", () => count++, { target });
    press(target, "k");
    unbind();
    press(target, "k");
    expect(count).to.equal(1);
  });

  it("double unbind is safe", () => {
    const unbind = bindKey("k", () => {}, { target });
    unbind();
    expect(() => unbind()).to.not.throw();
  });

  it("filters input/textarea/select by default", () => {
    const input = document.createElement("input");
    let count = 0;
    bindKey("k", () => count++, { target });
    press(target, "k", { target: input });
    expect(count).to.equal(0);
  });

  it("filters contenteditable by default", () => {
    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    let count = 0;
    bindKey("k", () => count++, { target });
    press(target, "k", { target: div });
    expect(count).to.equal(0);
  });

  it("does not filter when filterInputs is false", () => {
    const input = document.createElement("input");
    let count = 0;
    bindKey("k", () => count++, { target, filterInputs: false });
    press(target, "k", { target: input });
    expect(count).to.equal(1);
  });

  it("modifier combos bypass the input filter", () => {
    const input = document.createElement("input");
    let count = 0;
    bindKey("ctrl+k", () => count++, { target });
    press(target, "k", { ctrl: true, target: input });
    expect(count).to.equal(1);
  });

  it("sequence with any modifier-step bypasses input filter for all steps", () => {
    const input = document.createElement("input");
    let count = 0;
    bindKey("ctrl+g i", () => count++, { target });
    press(target, "g", { ctrl: true, target: input });
    press(target, "i", { target: input });
    expect(count).to.equal(1);
  });

  it("preventDefault is opt-in", () => {
    bindKey("k", () => {}, { target });
    const ev = press(target, "k");
    expect(ev.defaultPrevented).to.equal(false);
  });

  it("preventDefault fires on full match when enabled", () => {
    bindKey("k", () => {}, { target, preventDefault: true });
    const ev = press(target, "k");
    expect(ev.defaultPrevented).to.equal(true);
  });

  it("is case-insensitive", () => {
    let count = 0;
    bindKey("CTRL+K", () => count++, { target });
    press(target, "k", { ctrl: true });
    expect(count).to.equal(1);
  });

  it("handler receives the keyboard event", () => {
    let received: KeyboardEvent | null = null;
    bindKey(
      "k",
      (e) => {
        received = e;
      },
      { target },
    );
    press(target, "k");
    expect(received).to.not.equal(null);
    expect((received as unknown as KeyboardEvent).key).to.equal("k");
  });

  it("throws on empty combo", () => {
    expect(() => bindKey("", () => {}, { target })).to.throw(
      "must be a non-empty string",
    );
  });

  it("throws on combo with empty step", () => {
    expect(() => bindKey("ctrl+", () => {}, { target })).to.throw(
      "Invalid key combo",
    );
  });

  it("throws on combo with two non-modifier keys", () => {
    expect(() => bindKey("a+b", () => {}, { target })).to.throw(
      "Invalid key combo",
    );
  });

  it("throws when handler is not a function", () => {
    // @ts-expect-error - testing runtime guard
    expect(() => bindKey("k", "nope", { target })).to.throw(
      "must be a function",
    );
  });

  it("attaches to window when no target is given", () => {
    let count = 0;
    const unbind = bindKey("k", () => count++);
    press(window, "k");
    unbind();
    expect(count).to.equal(1);
  });

  it("matches `space` alias against the space key", () => {
    let count = 0;
    bindKey("space", () => count++, { target });
    press(target, " ", { code: "Space" });
    expect(count).to.equal(1);
  });

  it("matches `esc` alias against escape", () => {
    let count = 0;
    bindKey("esc", () => count++, { target });
    press(target, "Escape", { code: "Escape" });
    expect(count).to.equal(1);
  });

  it("matches `up` alias against arrowup", () => {
    let count = 0;
    bindKey("up", () => count++, { target });
    press(target, "ArrowUp", { code: "ArrowUp" });
    expect(count).to.equal(1);
  });

  it("matches shift+digit via event.code when key is a shifted symbol", () => {
    let count = 0;
    bindKey("shift+1", () => count++, { target });
    press(target, "!", { shift: true, code: "Digit1" });
    expect(count).to.equal(1);
  });

  it("matches shift+letter via event.key uppercase", () => {
    let count = 0;
    bindKey("shift+a", () => count++, { target });
    press(target, "A", { shift: true, code: "KeyA" });
    expect(count).to.equal(1);
  });

  it("ignores auto-repeat events by default", () => {
    let count = 0;
    bindKey("k", () => count++, { target });
    press(target, "k");
    press(target, "k", { repeat: true });
    press(target, "k", { repeat: true });
    expect(count).to.equal(1);
  });

  it("fires on auto-repeat when ignoreRepeat is false", () => {
    let count = 0;
    bindKey("k", () => count++, { target, ignoreRepeat: false });
    press(target, "k");
    press(target, "k", { repeat: true });
    press(target, "k", { repeat: true });
    expect(count).to.equal(3);
  });
});
