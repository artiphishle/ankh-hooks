import { useColorParser } from "./useColorParser"

/** @output hex */
function hslToHex(hslString: string) {
  rgbToHex(hslToRgb(hslString));
}
function labToHex(labString: string) {
  return rgbToHex(labToRgb(labString));
}
function lchToHex(lchString: string) {
  return rgbToHex(lchToRgb(lchString));
}
function rgbToHex(rgbString: string) {
  const numValues = useColorParser().parseRgb(rgbString);
  const hexValues = numValues.map((rgb: number) => rgb.toString(16));
  const hexFixed2 = hexValues.map((hex) => hex.length === 1 ? `0${hex}` : hex).join("");
  return `#${hexFixed2}`;
}
function xyzToHex(xyzString: string) {
  return rgbToHex(xyzToRgb(xyzString));
}

/** @output hexA */
function rgbaToHexA(rgbaString: string) {
  const numValues = useColorParser().parseRgbA(rgbaString);
  // const alpha = a! * 100 === 100 ? "" : a! * 100;
  const hexValues = numValues.map((rgba, i) => i === 3 ? `${rgba * 100}` : rgba.toString(16));
  const hexFixed2 = hexValues.map((hex, i) => {
    if (i === 3) return hex === "100" ? "" : hex;
    return hex.length === 1 ? `0${hex}` : hex;
  }).join("");
  return `#${hexFixed2}`
}

/** @output hsl */
function hexToHsl(hexString: string) {
  return rgbToHsl(hexToRgb(hexString));
}
function labToHsl(labString: string) {
  return xyzToHsl(labToXyz(labString));
}
function lchToHsl(lchString: string) {
  xyzToHsl(lchToXyz(lchString));
}
function rgbToHsl(rgbString: string) {
  const { parseRgb } = useColorParser();
  const rgb = parseRgb(rgbString);

  const r = rgb[0]! / 255
  const g = rgb[1]! / 255
  const b = rgb[2]! / 255

  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h! /= 6
  }

  h! *= 360
  s *= 100
  l *= 100

  const hsl = [h, s, l];

  return `hsl(${h}, ${s}, ${l})`
}
function xyzToHsl(xyzString: string) {
  return rgbToHsl(xyzToRgb(xyzString));
}

/** @output lab */
function hexToLab(hexString: string) {
  return rgbToLab(hexToRgb(hexString));
}
function hslToLab(hslString: string) {
  return rgbToLab(hslToRgb(hslString));
}
function lchToLab(lchString: string) {
  const { parseLch } = useColorParser();
  const [l, c, h] = parseLch(lchString);

  const a = Math.cos(h! * 0.01745329251) * c!;
  const b = Math.sin(h! * 0.01745329251) * c!;

  return `lab(${l}, ${a}, ${b})`;
}
function rgbToLab(rgbString: string) {
  return xyzToLab(rgbToXyz(rgbString));
}
function xyzToLab(xyzString: string) {
  const { parseXyz } = useColorParser();
  const xyz = parseXyz(xyzString);

  // Observer = 2°, Illuminant = D65
  let x = xyz[0]! / 95.047
  let y = xyz[1]! / 100.000
  let z = xyz[2]! / 108.883

  if (x > 0.008856) x = Math.pow(x, 0.333333333);
  else x = 7.787 * x + 0.137931034;

  if (y > 0.008856) y = Math.pow(y, 0.333333333);
  else y = 7.787 * y + 0.137931034;

  if (z > 0.008856) z = Math.pow(z, 0.333333333);
  else z = 7.787 * z + 0.137931034;

  const l = (116 * y) - 16
  const a = 500 * (x - y)
  const b = 200 * (y - z)

  return `lab(${l}, ${a}, ${b})`;
}

/** @output lch */
function hexToLch(hexString: string) {
  return xyzToHex(hexToXyz(hexString));
}
function hslToLch(hslString: string) {
  return labToLch(hslToLab(hslString));
}
function labToLch(labString: string) {
  const { parseLab } = useColorParser();
  const [l, a, b] = parseLab(labString);
  const c = Math.sqrt(Math.pow(a!, 2) + Math.pow(b!, 2))

  let h = Math.atan2(b!, a!) //Quadrant by signs
  if (h > 0) h = (h / Math.PI) * 180;
  else h = 360 - (Math.abs(h) / Math.PI) * 180;

  return `lch(${l}, ${c}, ${h})`;
}
function rgbToLch(rgbString: string) {
  return labToLch(rgbToLab(rgbString));
}
function xyzToLch(xyzString: string) {
  return labToLch(xyzToLab(xyzString));
}

/** @output rgb */
function hexToRgb(hexString: string) {
  const { parseHex } = useColorParser();
  const hex = parseHex(hexString);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const [r, g, b] = [parseInt(result![1]!, 16), parseInt(result![2]!, 16), parseInt(result![3]!, 16)] || [];
  return `rgb(${r}, ${g}, ${b})`;
}
function hslToRgb(hslString: string) {
  const { parseHsl } = useColorParser();
  const hsl = parseHsl(hslString);

  const h = hsl[0]! / 360
  const s = hsl[1]! / 100
  const l = hsl[2]! / 100

  let r, g, b

  if (s == 0) r = g = b = l // achromatic
  else {
    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  const rgb = [r *= 255, g *= 255, b *= 255]

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}
function labToRgb(labString: string) {
  return lchToRgb(labToLch(labString));
}
function lchToRgb(lchString: string) {
  return xyzToRgb(lchToXyz(lchString));
}
function xyzToRgb(xyzString: string) {
  const { parseXyz } = useColorParser();
  const xyz = parseXyz(xyzString);

  // Observer = 2°, Illuminant = D65
  const x = xyz[0]! / 100 // X from 0 to 95.047
  const y = xyz[1]! / 100 // Y from 0 to 100.000
  const z = xyz[2]! / 100 // Z from 0 to 108.883

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570

  if (r > 0.0031308) {
    r = 1.055 * (Math.pow(r, 0.41666667)) - 0.055
  } else {
    r = 12.92 * r
  }

  if (g > 0.0031308) {
    g = 1.055 * (Math.pow(g, 0.41666667)) - 0.055
  } else {
    g = 12.92 * g
  }

  if (b > 0.0031308) {
    b = 1.055 * (Math.pow(b, 0.41666667)) - 0.055
  } else {
    b = 12.92 * b
  }
  const rgb = [r *= 255, g *= 255, b *= 255]

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

/** @output xyz */
function hexToXyz(hexString: string) {
  return rgbToXyz(hexToRgb(hexString));
}
function hslToXyz(hslString: string) {
  return rgbToXyz(hslToRgb(hslString));
}
function labToXyz(labString: string) {
  const { parseLab } = useColorParser();
  const [l, a, b] = parseLab(labString);

  let y = (l! + 16) / 116
  let x = a! / 500 + y
  let z = y - b! / 200

  if (Math.pow(y, 3) > 0.008856) y = Math.pow(y, 3);
  else y = (y - 0.137931034) / 7.787;

  if (Math.pow(x, 3) > 0.008856) x = Math.pow(x, 3);
  else x = (x - 0.137931034) / 7.787;

  if (Math.pow(z, 3) > 0.008856) z = Math.pow(z, 3);
  else z = (z - 0.137931034) / 7.787;

  // Observer = 2°, Illuminant = D65
  x = 95.047 * x;
  y = 100.000 * y;
  z = 108.883 * z;

  return `xyz(${x}, ${y}, ${z})`;
}
function lchToXyz(lchString: string) {
  return labToXyz(lchToLab(lchString));
}
function rgbToXyz(rgbString: string) {
  const { parseRgb } = useColorParser();
  const rgb = parseRgb(rgbString);

  let r = rgb[0]! / 255
  let g = rgb[1]! / 255
  let b = rgb[2]! / 255

  if (r > 0.04045) {
    r = Math.pow(((r + 0.055) / 1.055), 2.4)
  } else {
    r = r / 12.92
  }

  if (g > 0.04045) {
    g = Math.pow(((g + 0.055) / 1.055), 2.4)
  } else {
    g = g / 12.92
  }

  if (b > 0.04045) {
    b = Math.pow(((b + 0.055) / 1.055), 2.4)
  } else {
    b = b / 12.92
  }

  r *= 100
  g *= 100
  b *= 100

  // Observer = 2°, Illuminant = D65
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505

  return `xyz(${x}, ${y}, ${z})`;
}

export function useColorConverter() {
  return {
    hslToHex,
    labToHex,
    lchToHex,
    rgbToHex,
    xyzToHex,

    rgbaToHexA,

    hexToHsl,
    labToHsl,
    lchToHsl,
    rgbToHsl,
    xyzToHsl,

    hexToLab,
    hslToLab,
    lchToLab,
    rgbToLab,
    xyzToLab,

    hexToLch,
    hslToLch,
    labToLch,
    rgbToLch,
    xyzToLch,

    hexToRgb,
    hslToRgb,
    labToRgb,
    lchToRgb,
    xyzToRgb,

    hexToXyz,
    hslToXyz,
    labToXyz,
    lchToXyz,
    rgbToXyz
  }
}