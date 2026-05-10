import type { ParallelParams, ParallelSettledResult } from "./types.js";

/**
 * Runs an async mapper over `items` with a concurrency cap (worker-pool semaphore).
 * Results preserve input order. Never rejects from `fn` errors — each item resolves
 * to a Promise.allSettled-shaped entry. Optional `signal` stops dispatching new work;
 * unstarted indices resolve as rejected with the signal's reason.
 *
 * @param params - The parameters object
 * @param params.items - Items to process
 * @param params.concurrency - Max in-flight tasks (positive integer)
 * @param params.fn - Mapper invoked with `(item, index)`; may be sync or async
 * @param params.signal - Optional AbortSignal to cancel pending work
 * @returns Array of `{ status, value | reason }` in input order
 *
 * @example
 * ```ts
 * const results = await parallel({
 *   items: urls,
 *   concurrency: 3,
 *   fn: async (url) => (await fetch(url)).json(),
 * });
 * // results[i] === { status: "fulfilled", value: ... } | { status: "rejected", reason: ... }
 * ```
 *
 * @keywords concurrency limit, semaphore, worker pool, async map, throttle parallel
 *
 * @throws Error if validation fails or if `signal` is already aborted
 */
async function parallel<T, R>({
  items,
  concurrency,
  fn,
  signal,
}: ParallelParams<T, R>): Promise<Array<ParallelSettledResult<R>>> {
  if (!Array.isArray(items)) {
    throw new Error("The 'items' parameter must be an array");
  }

  if (
    typeof concurrency !== "number" ||
    concurrency < 1 ||
    !Number.isInteger(concurrency)
  ) {
    throw new Error("The 'concurrency' parameter must be a positive integer");
  }

  if (typeof fn !== "function") {
    throw new Error("The 'fn' parameter must be a function");
  }

  if (signal !== undefined && !(signal instanceof AbortSignal)) {
    throw new Error("The 'signal' parameter must be an AbortSignal");
  }

  if (signal?.aborted) {
    throw signal.reason;
  }

  const results = new Array<ParallelSettledResult<R>>(items.length);
  let next = 0;

  const worker = async (): Promise<void> => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      if (signal?.aborted) {
        results[i] = { status: "rejected", reason: signal.reason };
        while (next < items.length) {
          const j = next++;
          results[j] = { status: "rejected", reason: signal.reason };
        }
        return;
      }
      try {
        const value = await fn(items[i] as T, i);
        results[i] = { status: "fulfilled", value };
      } catch (reason) {
        results[i] = { status: "rejected", reason };
      }
    }
  };

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, worker));
  return results;
}

export { parallel };
