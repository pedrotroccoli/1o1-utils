interface CopyToClipboardParams {
  text: string;
}

type CopyToClipboardResult = Promise<void>;

type CopyToClipboard = (params: CopyToClipboardParams) => CopyToClipboardResult;

export type { CopyToClipboard, CopyToClipboardParams, CopyToClipboardResult };
