import { TweenLite } from "gsap/TweenLite";
import { Expo } from "gsap/EasePack";
import { gridToAbsolute, absoluteToGrid } from "../display/pointconverter";
const PIXI = require("pixi.js");
const Square = require("./square").default;
const DisplayManager = require("../display/displaymanager").default;

// grid cell's half width
const GRID_UNIT = 40;

class Grid {
  constructor(app, container) {
    this.app = app;
    this.gridObjects = [];
    this.updateGridSize();
    const gridContainer = new PIXI.Container();
    this.gridContainer = gridContainer;
    container.addChild(gridContainer);

    this.displayManager = new DisplayManager(this.gridContainer);

    this.gridContainer.x = GRID_UNIT;
    this.gridContainer.y = app.renderer.height / 2;
  }

  drawSquare(coordinates, color) {
    const square = new Square({
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

  updateSquareHeight(square, height, duration = 5) {
    TweenLite.to(square, duration, {
      height,
      ease: Expo.easeOut,
      overwrite: true
    });
  }

  updateGridSize() {
    this.gridWidth = Math.ceil(this.app.renderer.width / (GRID_UNIT * 2));
    this.gridHeight = Math.ceil(this.app.renderer.height / (GRID_UNIT / 2));
  }

  getSquareAt(point) {
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
}

export default Grid;
export { GRID_UNIT };
