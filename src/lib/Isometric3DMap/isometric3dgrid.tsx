import Color from './utils/Color';
import Grid from './objects/grid';
import Square from './objects/square';
const PIXI = require('pixi.js');
const MapDataToGrid = require('./mapdata/mapdatatogrid').default;

export interface IIsometric3DGridInputParams {
  app: PIXI.Application;
  params: any;
}

class Isometric3DGrid {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private grid: Grid;
  // TODO: write specs for parameters object
  private params: any;
  // TODO: add type for ticker
  private ticker: any;

  private currentSquareIndex: number;
  private mapLength: number;
  // TODO: add local private interface for this object
  private map: any;
  private scale: number;
  private maxHeight: number = 0;
  private minHeight: number = 0;
  private killCallback: CallableFunction;

  /**
   * Map Settings
   */

  private waterLevel: number;
  private beachLevel: number;
  private forestLevel: number;
  private mountainLevel: number;
  private snowLevel: number;
  /**
   * Color Settings
   */
  private lowColor: Color;
  private highColor: Color;

  private waterColor: Color;
  private beachColor: Color;
  private forestColor: Color;
  private mountainColor: Color;
  private snowColor: Color;

  constructor(inputParams: IIsometric3DGridInputParams) {
    // external parameters
    this.app = inputParams.app;
    this.params = inputParams.params;
    // internal parameters
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    this.grid = new Grid(this.app, this.container);
    this.killCallback = () => null;
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
    // Color setting
    this.lowColor = new Color(255, 255, 128);
    this.highColor = new Color(179, 179, 255);

    this.waterColor = new Color(102, 102, 255);
    this.beachColor = new Color(255, 255, 179);
    this.forestColor = new Color(0, 179, 0);
    this.mountainColor = new Color(153, 102, 51);
    this.snowColor = new Color(242, 242, 242);
    // Map Settings
    this.waterLevel = 20;
    this.beachLevel = 40;
    this.forestLevel = 200;
    this.mountainLevel = 340;
    this.snowLevel = 500;

    // initial scale
    this.scale = this.params.mobile === true ? 0.35 : 0.5;
    this.container.scale.x = this.container.scale.y = this.scale;
    // init tick function & start populating grid
    this.tick = this.tick.bind(this);
    this.populateGrid();
    // init mouse listeners
    this.initMouseListeners();
  }

  initMouseListeners() {
    const _this = this;
    let lastMouseX: number, lastMouseY: number;

    const mouseDownListener = (event: Event) => {
      const mouse = _this.getMouseCoordinatesFromEvent(event);
      lastMouseX = mouse.x;
      lastMouseY = mouse.y;
      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('touchmove', mouseMoveListener);
    };
    const mouseMoveListener = (event: Event) => {
      const mouse = _this.getMouseCoordinatesFromEvent(event);
      const deltaX = ((mouse.x - lastMouseX) * 1) / this.scale;
      const deltaY = ((mouse.y - lastMouseY) * 1) / this.scale;
      _this.grid.gridContainer.x += deltaX;
      _this.grid.gridContainer.y += deltaY;
      lastMouseX = mouse.x;
      lastMouseY = mouse.y;
    };
    const mouseUpListener = () => {
      document.removeEventListener('mousemove', mouseMoveListener);
      document.removeEventListener('touchmove', mouseMoveListener);
    };

    document.addEventListener('mousedown', mouseDownListener);
    document.addEventListener('touchstart', mouseDownListener);
    document.addEventListener('mouseup', mouseUpListener);
    document.addEventListener('touchend', mouseUpListener);
  }

  getMouseCoordinatesFromEvent(event: Event) {
    if (event.hasOwnProperty('touches')) {
      const touchEvent: TouchEvent = event as TouchEvent;
      return {
        x: touchEvent.touches[0].pageX,
        y: touchEvent.touches[0].pageY
      };
    } else {
      const mouseEvent: MouseEvent = event as MouseEvent;
      return {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
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

    this.map.scaledMap.forEach((point: any) => {
      if (point.height > this.maxHeight) {
        this.maxHeight = point.height;
      } else if (point.height < this.minHeight) {
        this.minHeight = point.height;
      }
    });

    this.ticker.add(this.tick);
    this.ticker.start();
  }

  tick(time: number) {
    if (this.currentSquareIndex <= 0) {
      this.ticker.stop();
      return false;
    }
    // create 10 squares
    const minIndex = Math.max(this.currentSquareIndex - 10, 0);

    for (let i = this.currentSquareIndex; i >= minIndex; i--) {
      this.addSquare(i);
      this.currentSquareIndex--;
    }
    this.grid.drawAll();
  }

  addSquare(index: number) {
    const { x, y, height } = this.map.scaledMap[index];

    const t = (height - this.minHeight) / (this.maxHeight - this.minHeight);

    // let lerpedColor: Color;

    // if (height > 0 && height <= this.waterLevel) {
    //   lerpedColor = this.waterColor.lerpTo(this.beachColor, t);
    // } else if (height <= this.beachLevel && height > this.waterLevel) {
    //   lerpedColor = this.beachColor.lerpTo(this.forestColor, t);
    // } else if (height <= this.forestLevel && height > this.beachLevel) {
    //   lerpedColor = this.forestColor.lerpTo(this.mountainColor, t);
    // } else if (height <= this.mountainLevel && height > this.forestLevel) {
    //   lerpedColor = this.mountainColor.lerpTo(this.snowColor, t);
    // } else if (height > this.mountainLevel) {
    //   lerpedColor = this.snowColor;
    // } else {
    //   lerpedColor = new Color(0, 0, 0);
    // }

    const lerpedColor = this.lowColor.lerpTo(this.highColor, t);

    const square: Square = this.grid.drawSquare(
      { x, y, z: 0 },
      lerpedColor,
      false
    );
    this.grid.updateSquareHeight(square, Math.round(height), 0);
  }

  //----- RESIZE
  resize(event: Event) {
    return event;
  }

  kill(callback: CallableFunction) {
    if (!this.killCallback) {
      this.killCallback = callback;
    }
    this.ticker.stop();
    this.ticker.remove(this.tick);
    this.ticker.destroy();
  }
}

export default Isometric3DGrid;
