interface MapValuesParams<T extends Record<string, unknown>, R> {
  obj: T;
  iteratee: (value: T[keyof T], key: string, obj: T) => R;
}

type MapValuesResult<T extends Record<string, unknown>, R> = Record<keyof T, R>;

type MapValuesFn = <T extends Record<string, unknown>, R>(
  params: MapValuesParams<T, R>,
) => MapValuesResult<T, R>;

export type { MapValuesFn, MapValuesParams, MapValuesResult };
