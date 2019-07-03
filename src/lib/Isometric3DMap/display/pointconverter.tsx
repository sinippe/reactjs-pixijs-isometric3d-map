import { GRID_UNIT } from "../objects/grid";
import { IGridPoint } from "../interfaces/grid-point.interface";

/**
 * Converts grid coordinates to "real" coordinates
 * @param {Object} point
 * @param {Number} point.x
 * @param {Number} point.y
 * @param {Number} point.z
 */
const gridToAbsolute = function(point: IGridPoint) {
  point.z = point.z || 0;
  const x = GRID_UNIT + point.x * GRID_UNIT + point.y * GRID_UNIT;
  const y =
    GRID_UNIT / 2 +
    (point.x * GRID_UNIT) / 2 -
    (point.y * GRID_UNIT) / 2 -
    (point.z * GRID_UNIT) / 2;
  return { x, y };
};

/**
 * Converts "real" coordinates to grid coordinates.
 * z = 0 in return value: there is an infinite number of points
 * with different "z" values for each entry coordinate.
 * @param {Object} point
 * @param {Number} point.x
 * @param {Number} point.y
 */
const absoluteToGrid = function(point: IGridPoint) {
  // ajust input
  point.x += GRID_UNIT;
  point.y += GRID_UNIT / 2;
  // calculate the width of a square object
  const sideWidth = Math.sqrt(
    Math.pow(GRID_UNIT, 2) + Math.pow(GRID_UNIT / 2, 2)
  );
  // we make a triangle ABC with:
  // - A: point (0;0)
  // - B: point (point.x;0)
  // - C: drop a perpendicular from point B ; C is the intersection between
  // the perpendicular and the isometric X axis.
  // The hypotenuse is [AC]
  const hypotenuse = (sideWidth / GRID_UNIT) * point.x;
  // the opposite side is [BC]
  const oppositeSide = Math.sqrt(
    Math.pow(hypotenuse, 2) - Math.pow(point.x, 2)
  );
  const extraX = oppositeSide - point.y;
  //const supposedX = (hypotenuse - extraX) / sideWidth;

  const y = Math.floor(extraX / GRID_UNIT);
  const x = Math.floor((point.x - extraX) / GRID_UNIT) - 1;
  const z = 0;
  return { x, y, z };
};

export { gridToAbsolute, absoluteToGrid };
