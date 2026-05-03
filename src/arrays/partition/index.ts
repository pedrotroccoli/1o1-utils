import type {
  PartitionParams,
  PartitionResult,
  PartitionTypeGuardParams,
  PartitionTypeGuardResult,
} from "./types.js";

/**
 * Splits an array into two groups based on a predicate. The first group
 * contains items for which the predicate returns truthy; the second contains
 * the rest. Order is preserved within each group.
 *
 * Supports a type-guard predicate (`(item) => item is U`) to narrow the
 * resulting tuple to `[U[], Exclude<T, U>[]]`.
 *
 * @param params - The parameters object
 * @param params.array - The array to partition
 * @param params.predicate - Function called with `(item, index)` returning a boolean
 * @returns A tuple `[matches, rest]`
 *
 * @example
 * ```ts
 * partition({ array: [1, 2, 3, 4, 5], predicate: (n) => n % 2 === 0 });
 * // => [[2, 4], [1, 3, 5]]
 *
 * const users = [{ active: true }, { active: false }];
 * const [active, inactive] = partition({ array: users, predicate: (u) => u.active });
 * ```
 *
 * @keywords partition, split, divide, bifurcate, group, filter
 *
 * @throws Error if `array` is not an array
 * @throws Error if `predicate` is not a function
 */
function partition<T, U extends T>(
  params: PartitionTypeGuardParams<T, U>,
): PartitionTypeGuardResult<T, U>;
function partition<T>(params: PartitionParams<T>): PartitionResult<T>;
function partition<T>({
  array,
  predicate,
}: PartitionParams<T>): PartitionResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (typeof predicate !== "function") {
    throw new Error("The 'predicate' parameter must be a function");
  }

  const matches: T[] = [];
  const rest: T[] = [];

  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) {
      matches.push(array[i]);
    } else {
      rest.push(array[i]);
    }
  }

  return [matches, rest];
}

export { partition };
