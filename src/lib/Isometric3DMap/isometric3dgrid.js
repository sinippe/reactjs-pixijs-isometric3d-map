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
    this.grid = new Grid(this.app, this.container);
    // ticker
    this.ticker = PIXI.ticker.shared;
    this.ticker.autoStart = false;
    this.ticker.minFPS = 1;
    this.ticker.maxFPS = 100;
    // grid populating infos
    this.currentSquareIndex = 0;
    this.mapLength = 0;
    // map data infos
    this.map = {
      data: null,
      scaledMap: null,
      mapLength: 0
    };
    // initial scale
    this.scale = this.params.mobile === true ? 0.35 : 0.5;
    this.container.scale.x = this.container.scale.y = this.scale;
    // init tick function & start populating grid
    this.tick = this.tick.bind(this);
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
    this.map = {
      data: new MapDataToGrid(this.params.data)
    };
    this.map.scaledMap = this.map.data.getGrid();
    this.map.mapLength = this.map.scaledMap.length;

    this.currentSquareIndex = this.map.mapLength - 1;

    this.ticker.add(this.tick);
    this.ticker.start();
  }

  tick(time) {
    if (this.currentSquareIndex <= 0) {
      this.ticker.stop();
      return false;
    }
    if (this.currentSquareIndex <= 0) {
      this.ticker.stop();
      return false;
    }
    const { x, y, height } = this.map.scaledMap[this.currentSquareIndex];
    const color = `0x${getColorFromValue(height)}`;
    const square = this.grid.drawSquare({ x, y, z: 0 }, color);
    this.grid.updateSquareHeight(square, Math.round(height), 1);
    this.currentSquareIndex--;
  }

  //----- RESIZE
  resize(event) {
    return event;
  }

  kill(callback) {
    if (!this.killCallback) {
      this.killCallback = callback;
    }
    this.ticker.stop();
    this.ticker.remove(this.tick);
    this.ticker.destroy();
  }
}

export default Isometric3DGrid;
