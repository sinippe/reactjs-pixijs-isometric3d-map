import { GridDisplayObject } from "./grid-display-object";
import { IGridPoint } from "../interfaces/grid-point.interface";
import { Graphics } from "pixi.js";

class Square {
  private _height: number;
  private color: number;
  private graphics: GridDisplayObject;
  private graphicsInit: boolean;
  private lineWidth: number;
  private lineColor: number;
  private lineAlpha: number;
  private size: number;
  private square: Graphics;

  // TODO: add an interface to specify the parameters object's structure
  constructor(parameters: any) {
    this.size = parameters.size;
    this.color = parameters.color;
    this._height = parameters.height || 0;
    // local parameters + default values
    this.graphics = new GridDisplayObject();
    this.graphicsInit = false;
    this.lineWidth = 1;
    this.lineColor = 0xffffff;
    this.lineAlpha = 1;
    this.square = new Graphics();

    this.drawSquare();
  }

  drawSquare() {
    this.cacheGraphicsAsBitmap(false);
    this.clearSquare();
    this.drawSides();
    this.square.beginFill(this.color);
    this.square.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);
    this.square.moveTo(0, -this.height);
    this.square.lineTo(this.size, -this.size / 2 - this.height);
    this.square.lineTo(0, -this.size - this.height);
    this.square.lineTo(-this.size, -this.size / 2 - this.height);
    this.square.lineTo(0, -this.height);
    this.square.endFill();

    this.cacheGraphicsAsBitmap(true);
  }

  drawSides() {
    this.square.beginFill(this.color);
    this.square.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);
    this.square.moveTo(0, 0);
    this.square.lineTo(-this.size, -this.size / 2);
    this.square.lineTo(-this.size, -this.size / 2 - this.height);
    this.square.lineTo(0, -this.height);
    this.square.lineTo(0, 0);
    this.square.endFill();

    this.square.beginFill(this.color);
    this.square.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);
    this.square.moveTo(0, 0);
    this.square.lineTo(this.size, -this.size / 2);
    this.square.lineTo(this.size, -this.size / 2 - this.height);
    this.square.lineTo(0, -this.height);
    this.square.lineTo(0, 0);
    this.square.endFill();
  }

  clearSquare() {
    this.square.clear();
  }

  /**
   * Create a Sprite containing the graphics.
   * @param {Object} point Target coordinates on grid (gridX, gridY, gridZ properties)
   * @param {Number} point.x
   * @param {Number} point.y
   * @param {Number} point.z
   * @returns {Boolean} Whether or not the graphics' container has been created
   */
  createGraphics(point: IGridPoint) {
    if (
      typeof point.x === "undefined" ||
      typeof point.y === "undefined" ||
      typeof point.z === "undefined"
    ) {
      throw new Error(
        `Square.createGraphics: parameter 'point' has to have 'x', 'y' and 'z' properties`
      );
    }
    if (this.graphicsInit) {
      return false;
    }
    this.graphics = new GridDisplayObject();

    this.graphics.addChild(this.square);
    this.graphics.gridX = point.x;
    this.graphics.gridY = point.y;
    this.graphics.gridZ = point.z;

    this.graphicsInit = true;

    return true;
  }

  getGraphics(): GridDisplayObject {
    if (!this.graphicsInit) {
      throw new Error(
        `Square.getGraphics: not defined. Did you call 'createGraphics' first?'`
      );
    }
    return this.graphics;
  }

  cacheGraphicsAsBitmap(cache: boolean) {
    if (this.graphics) {
      this.graphics.cacheAsBitmap = cache;
    }
  }

  set height(height) {
    this._height = height;
    this.drawSquare();
  }
  get height() {
    return this._height;
  }
}

export default Square;
