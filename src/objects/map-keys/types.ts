interface MapKeysParams<T extends Record<string, unknown>> {
  obj: T;
  iteratee: (value: T[keyof T], key: string, obj: T) => PropertyKey;
}

type MapKeysResult<T extends Record<string, unknown>> = Record<
  string,
  T[keyof T]
>;

type MapKeysFn = <T extends Record<string, unknown>>(
  params: MapKeysParams<T>,
) => MapKeysResult<T>;

export type { MapKeysFn, MapKeysParams, MapKeysResult };
