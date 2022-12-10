import { Point2D } from "./types";

/**
  Angle between points
  @param [object]: X and Y coordinates of from point
  @param [object]: X and Y coordinates of to point
  @return [radian]: Angle between the two points in radians
*/
export const angle = (b: Point2D, a: Point2D = { x: 0, y: 0 }) => Math.atan2(b.y - a.y, b.x - a.x);
