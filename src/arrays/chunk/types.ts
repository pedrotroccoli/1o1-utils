interface ChunkParams<T> {
  array: T[];
  size: number;
}

type ChunkResult<T> = T[][];

type Chunk<T> = (params: ChunkParams<T>) => ChunkResult<T>;

export type { Chunk, ChunkParams, ChunkResult };
