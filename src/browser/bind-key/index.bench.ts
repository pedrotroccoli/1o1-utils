import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { Bench } from "tinybench";
import { bindKey } from "./index.js";

if (!GlobalRegistrator.isRegistered) {
  GlobalRegistrator.register();
}

const Mousetrap = (await import("mousetrap")).default as unknown as (
  el?: Element,
) => {
  bind(keys: string, cb: () => void): unknown;
  unbind(keys: string): unknown;
};

const noop = () => {};

const bench = new Bench({ name: "bindKey", time: 1000 });

// Isolated elements per library to avoid listener accumulation across phases.
const ownEl = document.createElement("div");
const mtEl = document.createElement("div");
const nativeEl = document.createElement("div");
document.body.appendChild(ownEl);
document.body.appendChild(mtEl);
document.body.appendChild(nativeEl);

// --- bind + unbind throughput ---

bench
  .add("1o1-utils (bind single)", () => {
    const unbind = bindKey("k", noop, { target: ownEl });
    unbind();
  })
  .add("mousetrap (bind single)", () => {
    const mt = Mousetrap(mtEl);
    mt.bind("k", noop);
    mt.unbind("k");
  })
  .add("native (bind single)", () => {
    nativeEl.addEventListener("keydown", noop);
    nativeEl.removeEventListener("keydown", noop);
  });

bench
  .add("1o1-utils (bind combo)", () => {
    const unbind = bindKey("ctrl+shift+p", noop, { target: ownEl });
    unbind();
  })
  .add("mousetrap (bind combo)", () => {
    const mt = Mousetrap(mtEl);
    mt.bind("ctrl+shift+p", noop);
    mt.unbind("ctrl+shift+p");
  })
  .add("native (bind combo)", () => {
    const handler = (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.ctrlKey && ke.shiftKey && ke.key === "p") noop();
    };
    nativeEl.addEventListener("keydown", handler);
    nativeEl.removeEventListener("keydown", handler);
  });

bench
  .add("1o1-utils (bind sequence)", () => {
    const unbind = bindKey("g i", noop, { target: ownEl });
    unbind();
  })
  .add("mousetrap (bind sequence)", () => {
    const mt = Mousetrap(mtEl);
    mt.bind("g i", noop);
    mt.unbind("g i");
  });

// --- dispatch hit throughput ---

const ownDispatchEl = document.createElement("div");
const mtDispatchEl = document.createElement("div");
const nativeDispatchEl = document.createElement("div");
document.body.appendChild(ownDispatchEl);
document.body.appendChild(mtDispatchEl);
document.body.appendChild(nativeDispatchEl);

bindKey("k", noop, { target: ownDispatchEl, filterInputs: false });
bindKey("ctrl+shift+p", noop, {
  target: ownDispatchEl,
  filterInputs: false,
});

const mtSingle = Mousetrap(mtDispatchEl);
mtSingle.bind("k", noop);
mtSingle.bind("ctrl+shift+p", noop);

const nativeSingleHandler = (e: Event) => {
  if ((e as KeyboardEvent).key === "k") noop();
};
const nativeComboHandler = (e: Event) => {
  const ke = e as KeyboardEvent;
  if (ke.ctrlKey && ke.shiftKey && ke.key === "p") noop();
};
nativeDispatchEl.addEventListener("keydown", nativeSingleHandler);
nativeDispatchEl.addEventListener("keydown", nativeComboHandler);

const fireSingle = () =>
  new KeyboardEvent("keydown", { key: "k", bubbles: true });
const fireCombo = () =>
  new KeyboardEvent("keydown", {
    key: "p",
    ctrlKey: true,
    shiftKey: true,
    bubbles: true,
  });

bench
  .add("1o1-utils (dispatch hit, single)", () => {
    ownDispatchEl.dispatchEvent(fireSingle());
  })
  .add("mousetrap (dispatch hit, single)", () => {
    mtDispatchEl.dispatchEvent(fireSingle());
  })
  .add("native (dispatch hit, single)", () => {
    nativeDispatchEl.dispatchEvent(fireSingle());
  });

bench
  .add("1o1-utils (dispatch hit, combo)", () => {
    ownDispatchEl.dispatchEvent(fireCombo());
  })
  .add("mousetrap (dispatch hit, combo)", () => {
    mtDispatchEl.dispatchEvent(fireCombo());
  })
  .add("native (dispatch hit, combo)", () => {
    nativeDispatchEl.dispatchEvent(fireCombo());
  });

export { bench };
