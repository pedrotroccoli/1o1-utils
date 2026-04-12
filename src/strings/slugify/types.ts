interface SlugifyParams {
  str: string;
}

type SlugifyResult = string;

type Slugify = (params: SlugifyParams) => SlugifyResult;

export type { Slugify, SlugifyParams, SlugifyResult };
