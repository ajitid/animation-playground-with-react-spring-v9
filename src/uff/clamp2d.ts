import { angle } from "./angle";
import { distance } from "./distance";
import { pointFromVector } from "./point-from-vector";
import { Point2D } from "./types";

// there is this another impl. but I think it would work fine with magnitudes
// but not with vectors (in quadrants which could have -ve values)
// https://stackoverflow.com/a/55502691 https://stackoverflow.com/a/41321162

export const clamp2D = (
  maxLength: number,
  point: Point2D,
  origin: Point2D = { x: 0, y: 0 }
): Point2D => {
  const length = distance(origin, point);
  if (length <= maxLength) {
    return point;
  }

  return pointFromVector(origin, angle(point, origin), maxLength);
};
