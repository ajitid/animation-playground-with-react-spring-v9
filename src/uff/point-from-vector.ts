import { Point2D } from "./types";

/**
  Point from angle and distance.
  Also known as pointFromAngleAndDistance.
 
  @param origin 2D point of origin
  @param angle Angle from origin in radians
  @param distance Distance from origin
  @return Calculated 2D point
*/
export const pointFromVector = (origin: Point2D, angle: number, distance: number) => {
  return {
    x: distance * Math.cos(angle) + origin.x,
    y: distance * Math.sin(angle) + origin.y,
  };
};
