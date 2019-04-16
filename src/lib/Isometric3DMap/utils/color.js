const getRandomColorChannel = () => {
  return 50 + Math.round((Math.random() + 1) * 40).padStart(2, "0");
};

export function getRandomColor() {
  const r = getRandomColorChannel();
  const g = getRandomColorChannel();
  const b = getRandomColorChannel();
  // format: "RRGGBB"
  return `${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

const getColorChannelFromValue = value => {
  return Math.round(value % 205)
    .toString(16)
    .padStart(2, "0");
};

export function getColorFromValue(value) {
  const r = getColorChannelFromValue(value);
  const g = getColorChannelFromValue(value);
  const b = getColorChannelFromValue(value);
  // format: "RRGGBB"
  return `${r}${g}${b}`;
}
