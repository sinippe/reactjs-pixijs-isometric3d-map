import { Container, DisplayObject } from 'pixi.js';
import { GridDisplayObject } from '../objects/grid-display-object';

export class DisplayManager {
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  addObjectToGrid(object: GridDisplayObject) {
    this.container.addChild(object as DisplayObject);
    this.orderObjects(this.container);
  }

  addObjectListToGrid(objectList: GridDisplayObject[]) {
    const sortedObjects = this.sortObjects(objectList);
    sortedObjects.forEach(object => {
      this.container.addChild(object);
    });
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
  private orderObjects(container: Container) {
    const children: GridDisplayObject[] = container.children as GridDisplayObject[];
    const sortedChildren = this.sortObjects(children);

    const childrenCount = sortedChildren.length;
    for (let i = 0; i < childrenCount; i++) {
      container.setChildIndex(sortedChildren[i], i);
    }
  }

  private sortObjects(objectList: GridDisplayObject[]) {
    return objectList.sort((a, b) => {
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
  }
}
