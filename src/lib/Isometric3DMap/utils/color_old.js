const getRandomColorChannel = () => {
  return 50 + Math.round((Math.random() + 1) * 40).padStart(2, '0');
};

export function getRandomColor() {
  const r = getRandomColorChannel();
  const g = getRandomColorChannel();
  const b = getRandomColorChannel();
  // format: "RRGGBB"
  return `${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

const getColorChannelFromValue = (value, max = 205) => {
  return Math.round(value % max)
    .toString(16)
    .padStart(2, '0');
};

export function getColorFromValue(value, max = 0) {
  const r = getColorChannelFromValue(value, max);
  const g = getColorChannelFromValue(value, max);
  const b = getColorChannelFromValue(value, max);
  // format: "RRGGBB"
  return `${r}${g}${b}`;
}

export function getColorFromHeightLerp(value, min = 0, max = 0) {
  const color = getColorFromValue(value, max);
  return Number(`0x${color}`);
}
