import { Container, DisplayObject } from "pixi.js";
import { GridDisplayObject } from "../objects/grid-display-object";

export class DisplayManager {
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  addObjectToGrid(object: GridDisplayObject) {
    this.container.addChild(object as DisplayObject);
    this.orderObjects(this.container);
  }

  removeObjectFromGrid(object: DisplayObject) {
    try {
      this.container.removeChild(object);
    } catch (e) {
      throw new Error(
        `DisplayManager.removeObjectFromGrid: specified object is not a child of the container.`
      );
    }
    this.orderObjects(this.container);
  }

  /**
   * Order objects' depths within container
   * @param {PIXI.Container} container
   */
  private orderObjects = function(container: Container) {
    //let children = container.children;
    let children: GridDisplayObject[] = container.children as GridDisplayObject[];
    // order children
    children.sort((a, b) => {
      if (a.gridX > b.gridX) {
        return 1;
      } else if (a.gridX < b.gridX) {
        return -1;
      } else if (a.gridY < b.gridY) {
        return 1;
      } else if (a.gridY > b.gridY) {
        return -1;
      } else {
        return 0;
      }
    });
    // testing all children
    const childrenCount = children.length;
    for (let i = 0; i < childrenCount; i++) {
      //this.testObject(children[i]);
      container.setChildIndex(children[i], i);
    }
  };
  /*
  private testObject = function(object) {
    if (
      typeof object.gridX === "undefined" ||
      typeof object.gridY === "undefined" ||
      typeof object.gridZ === "undefined"
    ) {
      throw new Error(
        `DisplayManager.addObjectToGrid: parameter object has to have gridX, gridY and gridZ coordinates.`
      );
    }
  };
  */
}

//export default DisplayManager;
