import { Point2D } from "./types";

// Popmotion's `distance` fn can calculate for 1D, 2D and 3D but that's an overkill for us rn.
export const distance = (point1: Point2D, point2: Point2D) =>
  Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
