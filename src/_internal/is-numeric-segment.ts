const MAX_NUMERIC_SEGMENT_LEN = 7;

function isNumericSegment(seg: string): boolean {
  if (seg.length === 0) return false;
  for (let i = 0; i < seg.length; i++) {
    const c = seg.charCodeAt(i);
    if (c < 48 || c > 57) return false;
  }
  return true;
}

function isNumericSlice(str: string, start: number, end: number): boolean {
  const span = end - start;
  if (span <= 0 || span > MAX_NUMERIC_SEGMENT_LEN) return false;
  for (let i = start; i < end; i++) {
    const c = str.charCodeAt(i);
    if (c < 48 || c > 57) return false;
  }
  return true;
}

export { isNumericSegment, isNumericSlice };
