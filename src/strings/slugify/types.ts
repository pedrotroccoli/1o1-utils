interface SlugifyParams {
  str: string;
  separator?: string;
}

type SlugifyResult = string;

type Slugify = (params: SlugifyParams) => SlugifyResult;

export type { Slugify, SlugifyParams, SlugifyResult };
