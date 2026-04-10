type SortByOrder = "asc" | "desc";

interface SortByParams<T> {
  array: T[];
  key: keyof T | (string & {});
  order?: SortByOrder;
}

export type { SortByOrder, SortByParams };
