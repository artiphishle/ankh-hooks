export enum EAnkhColorUnit {
  Hex,
  Hsl,
  Lab,
  Rgb,
}
export enum EAnkhColorParserError {
  InvalidFormat = 'Invalid format',
  InvalidHexFormat = 'Invalid HEX format',
  InvalidHslFormat = 'Invalid HSL format',
  InvalidLabFormat = 'Invalid LAB format',
  InvalidRgbFormat = 'Invalid RGB format',
}

export interface IAnkhColor {
  readonly value: string;
  readonly parsedValue: string | number[];
  readonly unit: EAnkhColorUnit;
}
export interface IAnkhUiColorHueItem {
  readonly value: string;
  readonly className?: string;
}
export interface IAnkhUiColorHue {
  readonly color: string;
}
export interface IAnkhColorTone {
  saturation: { min: number, max: number },
  brightness: { min: number, max: number }
}