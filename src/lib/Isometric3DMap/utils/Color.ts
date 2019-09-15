export default class Color {
  private r: number;

  private g: number;

  private b: number;

  private a: number;

  private h: number;

  private l: number;

  private s: number;

  constructor(_r: number = 0, _g: number = 0, _b: number = 0, _a: number = 1) {
    this.r = _r;
    this.g = _g;
    this.b = _b;
    this.a = _a;

    this.h = 0;
    this.s = 0;
    this.l = 0;

    this.loadHSL();
  }

  private loadHSL() {
    let r: number = this.r / 255;
    let g: number = this.g / 255;
    let b: number = this.b / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    let h: number = 0,
      s: number = 0,
      l: number = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    this.h = h;
    this.s = s;
    this.l = l;
  }

  private hue2RGB(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  private loadRGB() {
    let r: number, g: number, b: number;
    let h = this.h;
    let s = this.s;
    let l = this.l;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = this.hue2RGB(p, q, h + 1 / 3);
      g = this.hue2RGB(p, q, h);
      b = this.hue2RGB(p, q, h - 1 / 3);
    }

    this.r = r * 255;
    this.g = g * 255;
    this.b = b * 255;
  }

  static RGBtoHexa(color: Color) {}

  static hexaToRGB(hex: string) {
    return new Color();
  }

  public toHex() {
    return (this.r << 16) + (this.g << 8) + (this.b | 0);
  }

  static toRgbArray(color: Color) {
    return [color.r, color.g, color.b];
  }

  public lerpTo(color: Color, delta: number): Color {
    return new Color(
      this.r + (color.r - this.r) * delta,
      this.g + (color.g - this.g) * delta,
      this.b + (color.b - this.b) * delta,
      this.a + (color.a - this.a) * delta
    );
  }

  public lighten(percentage: number = 0): Color {
    this.l *= percentage / 100 + 1;
    this.loadRGB();
    return this;
  }

  public darken(percentage: number = 0): Color {
    const color = new Color(this.r, this.g, this.b);
    color.l *= 1 - percentage / 100;
    color.loadRGB();
    return color;
  }

  public toNumber() {
    const hexa =
      ('0' + this.r.toString(16)).slice(-2) +
      ('0' + this.g.toString(16)).slice(-2) +
      ('0' + this.b.toString(16)).slice(-2);
    return Number(`0x${hexa}`);
  }

  public toString() {
    return `${this.r} ${this.g} ${this.b}`;
  }

  private componentToHex(c: number) {
    var hex = c.toString(16).slice(-2);
    return hex.length === 1 ? '0' + hex : hex;
  }

  private rgbToHex(r: number, g: number, b: number) {
    return (
      this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)
    );
  }
}
