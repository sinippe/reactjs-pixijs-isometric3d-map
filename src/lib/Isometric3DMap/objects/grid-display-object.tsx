import { Sprite } from "pixi.js";
import { IGridDisplayObject } from "../interfaces/grid-display-object.interface";

export class GridDisplayObject extends Sprite implements IGridDisplayObject {
  public gridX: number = 0;
  public gridY: number = 0;
  public gridZ: number = 0;
}
