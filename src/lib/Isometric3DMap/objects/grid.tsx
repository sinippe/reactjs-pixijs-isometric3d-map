import { TweenLite } from "gsap";
import { Expo } from "gsap";

import { gridToAbsolute, absoluteToGrid } from "../display/pointconverter";
import Square from "./square";
import { DisplayManager } from "../display/displaymanager";
import { IGridPoint } from "../interfaces/grid-point.interface";

const PIXI = require("pixi.js");

// grid cell's half width
const GRID_UNIT = 40;

class Grid {
  private app: PIXI.Application;
  private displayManager: DisplayManager;
  public gridContainer: PIXI.Container;
  private gridObjects: Square[];
  private _gridWidth: number = 0;
  private _gridHeight: number = 0;

  constructor(app: PIXI.Application, container: PIXI.Container) {
    this.app = app;
    this.gridObjects = [];
    this.updateGridSize();
    this.gridContainer = new PIXI.Container();
    container.addChild(this.gridContainer);

    this.displayManager = new DisplayManager(this.gridContainer);

    this.gridContainer.x = GRID_UNIT;
    this.gridContainer.y = app.renderer.height / 2;
  }

  drawSquare(coordinates: IGridPoint, color: number): Square {
    const square: Square = new Square({
      size: GRID_UNIT,
      color
    });

    square.createGraphics({
      x: coordinates.x,
      y: coordinates.y,
      z: coordinates.z
    });
    const convertedCoordinates = gridToAbsolute(coordinates);
    const squareGraphics = square.getGraphics();
    squareGraphics.x = convertedCoordinates.x;
    squareGraphics.y = convertedCoordinates.y;

    this.displayManager.addObjectToGrid(squareGraphics);

    this.gridObjects.push(square);
    return square;
  }

  updateSquareHeight(square: Square, height: number, duration: number = 5) {
    TweenLite.to(square, duration, {
      height,
      ease: Expo.easeOut,
      overwrite: true
    });
  }

  updateGridSize() {
    this._gridWidth = Math.ceil(this.app.renderer.width / (GRID_UNIT * 2));
    this._gridHeight = Math.ceil(this.app.renderer.height / (GRID_UNIT / 2));
  }

  getSquareAt(point: IGridPoint) {
    const gridCoordinates = absoluteToGrid(point);
    const { x, y, z } = gridCoordinates;
    let returnObject;
    this.gridObjects.forEach(object => {
      const graphics = object.getGraphics();
      if (
        x === graphics.gridX &&
        y === graphics.gridY &&
        z === graphics.gridZ
      ) {
        returnObject = object;
        return;
      }
    });
    return returnObject;
  }

  getSquareSize() {
    return new PIXI.Point(GRID_UNIT, GRID_UNIT / 2);
  }

  getGridContainerCoordinates() {
    return {
      x: this.gridContainer.x,
      y: this.gridContainer.y
    };
  }

  get gridWidth(): number {
    return this._gridWidth;
  }

  get gridHeight(): number {
    return this._gridHeight;
  }
}

export default Grid;
export { GRID_UNIT };
