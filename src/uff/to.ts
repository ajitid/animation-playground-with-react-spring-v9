type Range = [min: number, max: number];

// used the name `to` because react-spring uses this name for interpolation
// `interp1d` or just `interp` may or may not be a better name
export function to([inpMin, inpMax]: Range, [outMin, outMax]: Range, x: number) {
  const inpRange = inpMax - inpMin;
  if (inpRange === 0) return outMin;

  return ((x - inpMin) * (outMax - outMin)) / (inpMax - inpMin) + outMin;
}
