const PIXI = require("pixi.js");

class Square {
  constructor(parameters) {
    this.size = parameters.size;
    this.color = parameters.color;
    this._height = parameters.height || 0;
    // local parameters
    this.lineWidth = 1;
    this.lineColor = 0xffffff;
    this.lineAlpha = 1;

    this.drawSquare();
  }

  drawSquare() {
    this.checkSquareExists();
    this.drawSides();
    this.square.beginFill(this.color);
    this.square.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);
    this.square.moveTo(0, -this.height);
    this.square.lineTo(this.size, -this.size / 2 - this.height);
    this.square.lineTo(0, -this.size - this.height);
    this.square.lineTo(-this.size, -this.size / 2 - this.height);
    this.square.lineTo(0, -this.height);
    this.square.endFill();
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

  checkSquareExists() {
    if (!this.square) {
      this.square = new PIXI.Graphics();
    } else {
      this.square.clear();
    }
  }

  /**
   * Create a Sprite containing the graphics.
   * @param {Object} point Target coordinates on grid (gridX, gridY, gridZ properties)
   * @param {Number} point.x
   * @param {Number} point.y
   * @param {Number} point.z
   * @returns {Boolean} Whether or not the graphics' container has been created
   */
  createGraphics(point) {
    if (
      typeof point.x === "undefined" ||
      typeof point.y === "undefined" ||
      typeof point.z === "undefined"
    ) {
      throw new Error(
        `Square.createGraphics: parameter 'point' has to have 'x', 'y' and 'z' properties`
      );
    }
    if (this.graphics) {
      return false;
    }
    const sprite = new PIXI.Sprite();
    sprite.addChild(this.square);
    sprite.gridX = point.x;
    sprite.gridY = point.y;
    sprite.gridZ = point.z;
    this.graphics = sprite;
    return true;
  }

  getGraphics() {
    if (!this.graphics) {
      throw new Error(
        `Square.getGraphics: not defined. Did you call 'createGraphics' first?'`
      );
    }
    return this.graphics;
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
