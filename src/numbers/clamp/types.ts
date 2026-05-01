interface ClampParams {
  value: number;
  min: number;
  max: number;
}

type ClampResult = number;

type Clamp = (params: ClampParams) => ClampResult;

export type { Clamp, ClampParams, ClampResult };
