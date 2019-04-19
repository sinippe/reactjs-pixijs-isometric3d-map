const HEIGHT = 300;

class MapDataToGrid {
  /**
   * @param {JSON} data JSON data
   * @returns {Array} Array of data, with objects sorted by "x" (longitude) then "y" (latitude)
   */
  constructor(data) {
    const rawData = data;
    // longitudes
    const longitudes = this.reduceArray(rawData, "longitude");
    // sorting longitudes in ascending order (West to East)
    longitudes.sort((a, b) => a - b);
    this.width = longitudes.length;

    // sorting latitudes in descending order (North to South)
    const latitudes = this.reduceArray(rawData, "latitude");
    latitudes.sort((a, b) => b - a);
    this.height = latitudes.length;

    // sorting elevations in ascending order
    const elevations = this.reduceArray(rawData, "elevation");
    elevations.sort((a, b) => a - b);
    // calculating elevation ratio
    const maxElevation = elevations[elevations.length - 1];
    const minElevation = elevations[0];
    const elevationMultiplier = HEIGHT / (maxElevation - minElevation);
    // converting values
    this.convertedData = rawData.map(object => {
      const { x, y, height } = {
        x: longitudes.indexOf(object.longitude),
        y: latitudes.indexOf(object.latitude),
        height: object.elevation * elevationMultiplier
      };
      return { x, y, height };
    });
  }
  getGrid() {
    return this.convertedData;
  }

  /**
   * Returns an array filled with `array[value]`
   * @param {Array} array
   * @param {String} value
   */
  reduceArray(array, value) {
    const reducedArray = [];
    array.reduce((current, object) => {
      if (current.indexOf(object[value]) === -1) {
        current.push(object[value]);
      }
      return current;
    }, reducedArray);
    return reducedArray;
  }

  /**
   * Scale initial values: make a new grid populated with average values
   * @param {Number} scale Number between 0 and 1: 0 < scale < 1
   */
  scaleGrid(scale) {
    if (!scaleIsValid(scale)) {
      return [];
    }
    const averageValues = [];
    const n = this.convertedData.length;
    const newWidth = this.width * scale;
    const newHeight = this.height * scale;
    for (let i = 0; i < n; i++) {
      const x = Math.floor(i % newWidth);
      const y = Math.floor(i / newWidth) % newHeight;
      if (!averageValues[x]) {
        averageValues[x] = [];
      }
      if (!averageValues[x][y]) {
        averageValues[x][y] = [];
      }
      averageValues[x][y].push(this.convertedData[i].height);
    }
    const grid = [];
    averageValues.forEach((yValues, x) => {
      yValues.forEach((valueList, y) => {
        const sum = valueList.reduce((a, b) => a + b);
        const height = Math.round(sum / valueList.length);
        grid.push({
          x,
          y,
          height
        });
      });
    });
    return grid;
  }
}

function scaleIsValid(scale) {
  if (scale <= 0 || scale >= 1) {
    throw new Error(
      "MapDataToGrid: scale has to be greater than 0 and lower than 1."
    );
  }
  return true;
}

export default MapDataToGrid;
