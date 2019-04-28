import { getColorFromValue } from "./utils/color";
const PIXI = require("pixi.js");
const Grid = require("./objects/grid").default;
const MapDataToGrid = require("./mapdata/mapdatatogrid").default;

class Isometric3DGrid {
  constructor({ app, params }) {
    // external parameters
    this.app = app;
    this.params = params;
    // internal parameters
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    this.killing = false;
    this.grid = new Grid(this.app, this.container);
    // initial scale
    this.scale = this.params.mobile === true ? 0.35 : 0.5;
    this.container.scale.x = this.container.scale.y = this.scale;
    this.populateGrid();

    this.initMouseListeners();
  }

  initMouseListeners() {
    const _this = this;
    let lastMouseX, lastMouseY;

    const mouseDownListener = event => {
      const mouse = _this.getMouseCoordinatesFromEvent(event);
      lastMouseX = mouse.x;
      lastMouseY = mouse.y;
      document.addEventListener("mousemove", mouseMoveListener);
      document.addEventListener("touchmove", mouseMoveListener);
    };
    const mouseMoveListener = event => {
      const mouse = _this.getMouseCoordinatesFromEvent(event);
      const deltaX = ((mouse.x - lastMouseX) * 1) / this.scale;
      const deltaY = ((mouse.y - lastMouseY) * 1) / this.scale;
      _this.grid.gridContainer.x += deltaX;
      _this.grid.gridContainer.y += deltaY;
      lastMouseX = mouse.x;
      lastMouseY = mouse.y;
    };
    const mouseUpListener = () => {
      document.removeEventListener("mousemove", mouseMoveListener);
      document.removeEventListener("touchmove", mouseMoveListener);
    };

    document.addEventListener("mousedown", mouseDownListener);
    document.addEventListener("touchstart", mouseDownListener);
    document.addEventListener("mouseup", mouseUpListener);
    document.addEventListener("touchend", mouseUpListener);
  }

  getMouseCoordinatesFromEvent(event) {
    if (event.touches) {
      return {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY
      };
    } else {
      return {
        x: event.clientX,
        y: event.clientY
      };
    }
  }

  populateGrid() {
    const map = new MapDataToGrid(this.params.data);
    const scaledMap = map.getGrid();

    const mapLength = scaledMap.length;
    for (let i = 0; i < mapLength; i++) {
      const { x, y, height } = scaledMap[i];
      const color = `0x${getColorFromValue(height)}`;
      const square = this.grid.drawSquare({ x, y, z: 0 }, color);
      this.grid.updateSquareHeight(square, Math.round(height), 0);
    }
  }

  //----- RESIZE
  resize(event) {
    return event;
  }

  kill(callback) {
    if (!this.killCallback) {
      this.killCallback = callback;
    }
  }
}

export default Isometric3DGrid;
