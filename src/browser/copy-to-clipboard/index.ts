import type { CopyToClipboardParams, CopyToClipboardResult } from "./types.js";

/**
 * Copies a string to the system clipboard. Uses the asynchronous Clipboard API
 * when available in a secure context and falls back to a hidden `<textarea>`
 * plus `document.execCommand("copy")` for older browsers.
 *
 * Browser-only utility — does not work in Node.js or other non-DOM
 * environments.
 *
 * @param params - The parameters object
 * @param params.text - The string to copy to the clipboard
 * @returns A promise that resolves once the text has been copied
 *
 * @example
 * ```ts
 * await copyToClipboard({ text: "Hello world" });
 * ```
 *
 * @keywords clipboard, copy, copy text, copy to clipboard, paste, navigator clipboard, execCommand
 *
 * @see Clipboard API — https://developer.mozilla.org/docs/Web/API/Clipboard_API
 *
 * @throws Error if `text` is not a string
 * @throws Error if no clipboard mechanism is available in the current environment
 * @throws Error if the `document.execCommand("copy")` fallback fails
 *
 * @remarks
 * The Clipboard API is only used when `globalThis.isSecureContext` is `true`
 * (HTTPS or `localhost`). When the API rejects (e.g. `NotAllowedError`,
 * document not focused) and a `document.body` is available, the function
 * falls back to inserting a hidden, off-screen `<textarea>`, selecting its
 * content via a Range + Selection (required by iOS Safari, which ignores
 * `select()` on readonly textareas), running the deprecated
 * `execCommand("copy")`, and removing the node afterwards. The fallback
 * preserves any prior user selection by saving and restoring it. It must
 * be invoked from within a user gesture handler (click, keydown, etc.).
 */
async function copyToClipboard({
  text,
}: CopyToClipboardParams): CopyToClipboardResult {
  if (typeof text !== "string") {
    throw new Error("The 'text' parameter must be a string");
  }

  const g = globalThis as typeof globalThis & {
    isSecureContext?: boolean;
    navigator?: { clipboard?: { writeText?: (data: string) => Promise<void> } };
    document?: Document;
    getSelection?: () => Selection | null;
  };

  if (g.isSecureContext === true && g.navigator?.clipboard?.writeText) {
    try {
      await g.navigator.clipboard.writeText(text);
      return;
    } catch (err) {
      if (!g.document?.body) {
        throw err;
      }
    }
  }

  const doc = g.document;
  if (!doc?.body) {
    throw new Error("Clipboard not available in this environment");
  }

  const textarea = doc.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("aria-hidden", "true");
  // iOS Safari requires both contentEditable and readOnly on the textarea
  // for the Range/Selection trick to copy without mutating the input.
  textarea.contentEditable = "true";
  textarea.readOnly = true;
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  doc.body.appendChild(textarea);

  const selection = g.getSelection?.();
  const savedRanges: Range[] = [];
  if (selection) {
    for (let i = 0; i < selection.rangeCount; i++) {
      savedRanges.push(selection.getRangeAt(i));
    }
  }

  try {
    const range = doc.createRange();
    range.selectNodeContents(textarea);
    selection?.removeAllRanges();
    selection?.addRange(range);
    textarea.setSelectionRange(0, text.length);
    textarea.select();
    const ok = doc.execCommand("copy");
    if (!ok) {
      throw new Error("Failed to copy to clipboard");
    }
  } finally {
    textarea.remove();
    if (selection) {
      selection.removeAllRanges();
      for (const r of savedRanges) {
        selection.addRange(r);
      }
    }
  }
}

export { copyToClipboard };
