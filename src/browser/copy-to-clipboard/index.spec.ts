import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import { copyToClipboard } from "./index.js";

type GlobalLike = typeof globalThis & {
  isSecureContext?: boolean;
  navigator?: unknown;
  document?: unknown;
  getSelection?: unknown;
};

const g = globalThis as GlobalLike;

type GlobalKey = "isSecureContext" | "navigator" | "document" | "getSelection";

const originals: Record<GlobalKey, PropertyDescriptor | undefined> = {
  isSecureContext: undefined,
  navigator: undefined,
  document: undefined,
  getSelection: undefined,
};

const KEYS: readonly GlobalKey[] = [
  "isSecureContext",
  "navigator",
  "document",
  "getSelection",
];

function snapshot() {
  for (const key of KEYS) {
    originals[key] = Object.getOwnPropertyDescriptor(g, key);
  }
}

function restore() {
  for (const key of KEYS) {
    const desc = originals[key];
    if (desc) {
      Object.defineProperty(g, key, desc);
    } else {
      delete (g as Record<string, unknown>)[key];
    }
  }
}

function setGlobal(key: GlobalKey, value: unknown) {
  Object.defineProperty(g, key, {
    value,
    configurable: true,
    writable: true,
  });
}

function clearGlobal(key: GlobalKey) {
  delete (g as Record<string, unknown>)[key];
}

describe("copyToClipboard", () => {
  beforeEach(() => {
    snapshot();
  });

  afterEach(() => {
    restore();
  });

  describe("Clipboard API path", () => {
    it("should call navigator.clipboard.writeText with the text", async () => {
      const calls: string[] = [];
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {
        clipboard: {
          writeText: async (data: string) => {
            calls.push(data);
          },
        },
      });

      await copyToClipboard({ text: "Hello world" });

      expect(calls).to.deep.equal(["Hello world"]);
    });

    it("should propagate rejection from navigator.clipboard.writeText", async () => {
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {
        clipboard: {
          writeText: async () => {
            throw new Error("denied");
          },
        },
      });

      let caught: Error | undefined;
      try {
        await copyToClipboard({ text: "x" });
      } catch (err) {
        caught = err as Error;
      }
      expect(caught?.message).to.equal("denied");
    });

    it("should copy an empty string", async () => {
      const calls: string[] = [];
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {
        clipboard: {
          writeText: async (data: string) => {
            calls.push(data);
          },
        },
      });

      await copyToClipboard({ text: "" });

      expect(calls).to.deep.equal([""]);
    });
  });

  describe("execCommand fallback path", () => {
    function makeFakeDoc(execResult: boolean) {
      const appended: unknown[] = [];
      const removed: unknown[] = [];
      const execCalls: string[] = [];
      const ranges: Array<{ selectedNode: unknown }> = [];
      const elements: Array<{ tag: string; node: Record<string, unknown> }> =
        [];
      const body = {
        appendChild(node: unknown) {
          appended.push(node);
        },
      };
      const doc = {
        body,
        createElement(tag: string) {
          const node: Record<string, unknown> = {
            tag,
            value: "",
            contentEditable: "",
            readOnly: false,
            style: {} as Record<string, string>,
            attrs: {} as Record<string, string>,
            setAttribute(name: string, val: string) {
              (this.attrs as Record<string, string>)[name] = val;
            },
            setSelectionRange(start: number, end: number) {
              (this as Record<string, unknown>).selectionStart = start;
              (this as Record<string, unknown>).selectionEnd = end;
            },
            select() {
              (this as Record<string, unknown>).selected = true;
            },
            remove() {
              removed.push(this);
            },
          };
          elements.push({ tag, node });
          return node;
        },
        createRange() {
          const range = {
            selectedNode: undefined as unknown,
            selectNodeContents(node: unknown) {
              this.selectedNode = node;
            },
          };
          ranges.push(range);
          return range;
        },
        execCommand(cmd: string) {
          execCalls.push(cmd);
          return execResult;
        },
      };
      const selection = {
        cleared: 0,
        added: [] as unknown[],
        ranges: [] as unknown[],
        get rangeCount() {
          return this.ranges.length;
        },
        getRangeAt(i: number) {
          return this.ranges[i];
        },
        removeAllRanges() {
          this.cleared++;
          this.ranges = [];
        },
        addRange(range: unknown) {
          this.added.push(range);
          this.ranges.push(range);
        },
      };
      return {
        doc,
        appended,
        removed,
        execCalls,
        elements,
        ranges,
        selection,
      };
    }

    it("should copy via textarea + execCommand when secure context is false", async () => {
      const fake = makeFakeDoc(true);
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      setGlobal("document", fake.doc);
      setGlobal("getSelection", () => fake.selection);

      await copyToClipboard({ text: "Fallback" });

      expect(fake.execCalls).to.deep.equal(["copy"]);
      expect(fake.elements).to.have.lengthOf(1);
      expect(fake.elements[0].tag).to.equal("textarea");
      expect(fake.elements[0].node.value).to.equal("Fallback");
      expect(fake.appended).to.have.lengthOf(1);
      expect(fake.removed).to.have.lengthOf(1);
      expect(fake.removed[0]).to.equal(fake.elements[0].node);
    });

    it("should set contentEditable, readOnly, and use Range/Selection for iOS Safari support", async () => {
      const fake = makeFakeDoc(true);
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      setGlobal("document", fake.doc);
      setGlobal("getSelection", () => fake.selection);

      await copyToClipboard({ text: "iOS" });

      expect(fake.elements[0].node.contentEditable).to.equal("true");
      expect(fake.elements[0].node.readOnly).to.equal(true);
      expect(fake.ranges).to.have.lengthOf(1);
      expect(fake.ranges[0].selectedNode).to.equal(fake.elements[0].node);
      expect(fake.selection.added[0]).to.equal(fake.ranges[0]);
      expect(fake.elements[0].node.selectionStart).to.equal(0);
      expect(fake.elements[0].node.selectionEnd).to.equal(3);
    });

    it("should save and restore the user's existing selection (cloned)", async () => {
      const fake = makeFakeDoc(true);
      const cloned: unknown[] = [];
      const userRange = {
        id: "user-range",
        cloneRange() {
          const clone = { id: "user-range-clone", source: this };
          cloned.push(clone);
          return clone;
        },
      };
      fake.selection.ranges = [userRange];
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      setGlobal("document", fake.doc);
      setGlobal("getSelection", () => fake.selection);

      await copyToClipboard({ text: "x" });

      expect(cloned).to.have.lengthOf(1);
      expect(fake.selection.ranges).to.deep.equal([cloned[0]]);
      expect(fake.selection.added[0]).to.equal(fake.ranges[0]);
      expect(fake.selection.added[1]).to.equal(cloned[0]);
    });

    it("should fall back to execCommand when Clipboard API rejects", async () => {
      const fake = makeFakeDoc(true);
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {
        clipboard: {
          writeText: async () => {
            throw new Error("NotAllowedError");
          },
        },
      });
      setGlobal("document", fake.doc);
      setGlobal("getSelection", () => fake.selection);

      await copyToClipboard({ text: "fallback" });

      expect(fake.execCalls).to.deep.equal(["copy"]);
      expect(fake.elements[0].node.value).to.equal("fallback");
    });

    it("should propagate Clipboard API rejection when no fallback is possible", async () => {
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {
        clipboard: {
          writeText: async () => {
            throw new Error("denied");
          },
        },
      });
      clearGlobal("document");

      let caught: Error | undefined;
      try {
        await copyToClipboard({ text: "x" });
      } catch (err) {
        caught = err as Error;
      }
      expect(caught?.message).to.equal("denied");
    });

    it("should copy via fallback when navigator.clipboard is unavailable", async () => {
      const fake = makeFakeDoc(true);
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {});
      setGlobal("document", fake.doc);
      setGlobal("getSelection", () => fake.selection);

      await copyToClipboard({ text: "x" });

      expect(fake.execCalls).to.deep.equal(["copy"]);
    });

    it("should not throw when getSelection is unavailable", async () => {
      const fake = makeFakeDoc(true);
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      setGlobal("document", fake.doc);
      clearGlobal("getSelection");

      await copyToClipboard({ text: "no-selection" });

      expect(fake.execCalls).to.deep.equal(["copy"]);
    });

    it("should be a no-op for empty string in fallback path", async () => {
      const fake = makeFakeDoc(true);
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      setGlobal("document", fake.doc);
      setGlobal("getSelection", () => fake.selection);

      await copyToClipboard({ text: "" });

      expect(fake.execCalls).to.deep.equal([]);
      expect(fake.elements).to.have.lengthOf(0);
    });

    it("should attach Clipboard API rejection as cause when fallback also fails", async () => {
      const fake = makeFakeDoc(false);
      const apiErr = new Error("NotAllowedError");
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {
        clipboard: {
          writeText: async () => {
            throw apiErr;
          },
        },
      });
      setGlobal("document", fake.doc);
      setGlobal("getSelection", () => fake.selection);

      let caught: Error | undefined;
      try {
        await copyToClipboard({ text: "x" });
      } catch (err) {
        caught = err as Error;
      }

      expect(caught?.message).to.equal("Failed to copy to clipboard");
      expect((caught as Error & { cause?: unknown })?.cause).to.equal(apiErr);
    });

    it("should remove textarea even when execCommand fails", async () => {
      const fake = makeFakeDoc(false);
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      setGlobal("document", fake.doc);
      setGlobal("getSelection", () => fake.selection);

      let caught: Error | undefined;
      try {
        await copyToClipboard({ text: "x" });
      } catch (err) {
        caught = err as Error;
      }

      expect(caught?.message).to.equal("Failed to copy to clipboard");
      expect(fake.removed).to.have.lengthOf(1);
    });
  });

  describe("environment unavailable", () => {
    it("should throw when neither Clipboard API nor document is available", async () => {
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      clearGlobal("document");

      let caught: Error | undefined;
      try {
        await copyToClipboard({ text: "x" });
      } catch (err) {
        caught = err as Error;
      }

      expect(caught?.message).to.equal(
        "Clipboard not available in this environment",
      );
    });

    it("should throw when document exists but body is null", async () => {
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      setGlobal("document", { body: null, createElement: () => ({}) });

      let caught: Error | undefined;
      try {
        await copyToClipboard({ text: "x" });
      } catch (err) {
        caught = err as Error;
      }

      expect(caught?.message).to.equal(
        "Clipboard not available in this environment",
      );
    });
  });

  describe("invalid inputs", () => {
    it("should reject if text is not a string", async () => {
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {
        clipboard: { writeText: async () => undefined },
      });

      let caught: Error | undefined;
      try {
        // @ts-expect-error - we want to test the error case
        await copyToClipboard({ text: 123 });
      } catch (err) {
        caught = err as Error;
      }
      expect(caught?.message).to.equal("The 'text' parameter must be a string");
    });

    it("should reject if text is undefined", async () => {
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {
        clipboard: { writeText: async () => undefined },
      });

      let caught: Error | undefined;
      try {
        // @ts-expect-error - we want to test the error case
        await copyToClipboard({ text: undefined });
      } catch (err) {
        caught = err as Error;
      }
      expect(caught?.message).to.equal("The 'text' parameter must be a string");
    });
  });
});
