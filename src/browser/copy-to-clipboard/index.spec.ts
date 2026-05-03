import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import { copyToClipboard } from "./index.js";

type GlobalLike = typeof globalThis & {
  isSecureContext?: boolean;
  navigator?: unknown;
  document?: unknown;
};

const g = globalThis as GlobalLike;

const originals: {
  isSecureContext: PropertyDescriptor | undefined;
  navigator: PropertyDescriptor | undefined;
  document: PropertyDescriptor | undefined;
} = {
  isSecureContext: undefined,
  navigator: undefined,
  document: undefined,
};

function snapshot() {
  originals.isSecureContext = Object.getOwnPropertyDescriptor(
    g,
    "isSecureContext",
  );
  originals.navigator = Object.getOwnPropertyDescriptor(g, "navigator");
  originals.document = Object.getOwnPropertyDescriptor(g, "document");
}

function restore() {
  for (const key of ["isSecureContext", "navigator", "document"] as const) {
    const desc = originals[key];
    if (desc) {
      Object.defineProperty(g, key, desc);
    } else {
      delete (g as Record<string, unknown>)[key];
    }
  }
}

function setGlobal(
  key: "isSecureContext" | "navigator" | "document",
  value: unknown,
) {
  Object.defineProperty(g, key, {
    value,
    configurable: true,
    writable: true,
  });
}

function clearGlobal(key: "isSecureContext" | "navigator" | "document") {
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
            style: {} as Record<string, string>,
            attrs: {} as Record<string, string>,
            setAttribute(name: string, val: string) {
              (this.attrs as Record<string, string>)[name] = val;
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
        execCommand(cmd: string) {
          execCalls.push(cmd);
          return execResult;
        },
      };
      return { doc, appended, removed, execCalls, elements };
    }

    it("should copy via textarea + execCommand when secure context is false", async () => {
      const fake = makeFakeDoc(true);
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      setGlobal("document", fake.doc);

      await copyToClipboard({ text: "Fallback" });

      expect(fake.execCalls).to.deep.equal(["copy"]);
      expect(fake.elements).to.have.lengthOf(1);
      expect(fake.elements[0].tag).to.equal("textarea");
      expect(fake.elements[0].node.value).to.equal("Fallback");
      expect(fake.appended).to.have.lengthOf(1);
      expect(fake.removed).to.have.lengthOf(1);
      expect(fake.removed[0]).to.equal(fake.elements[0].node);
    });

    it("should copy via fallback when navigator.clipboard is unavailable", async () => {
      const fake = makeFakeDoc(true);
      setGlobal("isSecureContext", true);
      setGlobal("navigator", {});
      setGlobal("document", fake.doc);

      await copyToClipboard({ text: "x" });

      expect(fake.execCalls).to.deep.equal(["copy"]);
    });

    it("should remove textarea even when execCommand fails", async () => {
      const fake = makeFakeDoc(false);
      setGlobal("isSecureContext", false);
      clearGlobal("navigator");
      setGlobal("document", fake.doc);

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
