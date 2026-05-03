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
 * (HTTPS or `localhost`). On insecure pages and older browsers the function
 * inserts a hidden, off-screen `<textarea>`, selects its content, runs the
 * deprecated `execCommand("copy")`, and removes the node afterwards. The
 * fallback requires a `document` and must be invoked from within a user
 * gesture handler (click, keydown, etc.).
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
  };

  if (g.isSecureContext === true && g.navigator?.clipboard?.writeText) {
    await g.navigator.clipboard.writeText(text);
    return;
  }

  const doc = g.document;
  if (!doc?.body) {
    throw new Error("Clipboard not available in this environment");
  }

  const textarea = doc.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute("aria-hidden", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  doc.body.appendChild(textarea);

  try {
    textarea.select();
    const ok = doc.execCommand("copy");
    if (!ok) {
      throw new Error("Failed to copy to clipboard");
    }
  } finally {
    textarea.remove();
  }
}

export { copyToClipboard };
