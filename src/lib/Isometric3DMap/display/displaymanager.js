class DisplayManager {
  constructor(container) {
    this.container = container;
  }

  addObjectToGrid(object) {
    testObject(object);
    this.container.addChild(object);
    orderObjects(this.container);
  }

  removeObjectFromGrid(object) {
    try {
      this.container.removeChild(object);
    } catch (e) {
      throw new Error(
        `DisplayManager.removeObjectFromGrid: specified object is not a child of the container.`
      );
    }
    orderObjects(this.container);
  }
}
/**
 * Order objects' depths within container
 * @param {PIXI.Container} container
 */
function orderObjects(container) {
  let children = container.children;
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
    testObject(children[i]);
    container.setChildIndex(children[i], i);
  }
}

function testObject(object) {
  if (
    typeof object.gridX === "undefined" ||
    typeof object.gridY === "undefined" ||
    typeof object.gridZ === "undefined"
  ) {
    throw new Error(
      `DisplayManager.addObjectToGrid: parameter object has to have gridX, gridY and gridZ coordinates.`
    );
  }
}

export default DisplayManager;
