const generateHslColor = ({ hue, range }: any) => {
  const { s, l } = range;
  const saturation = Math.random() * (s.max - s.min) + s.min;
  const lightness = Math.random() * (l.max - l.min) + l.min;
  return `hsl(${hue}, ${saturation}% ${lightness}%)`;
}
function generatePalette({ count = 4, hue, range }: IGeneratePalette) {
  return new Array(count).fill({ hue, range }).map(() => generateHslColor({ hue, range }))
}

/**
 * Good Designs combine different tones
 * 
 * @example Pastel & Earth
 * @example Jewel & Pastel
 * @example Shade & Pastel
 * @example Natural & Earth
 * @example Fluorescent & Shade
 * 
 * COLOR HARMONY
 * 
 * @harmony Monochromatic:
 * Uses one hue with different saturation & brightness
 * 
 * @harmony Analogous
 * Uses colors that are next to eachother on the wheel
 * 
 * @harmony Complimentary
 * Uses colors that are on the opposite of the wheel
 * 
 * @harmony Split complimentary
 * Uses colors that are on the either side of a colors compliment
 * 
 * @harmony Triadic
 * Uses three colors that are evenly spaced
 * 
 * @guideline Harmony:
 * - Colors should work well together using the principles of color theory
 * 
 * @guideline Scalable & Additive:
 * - Should have multiple shades of gray and low saturated colors
 * - Could have a systematic pattern which can be added to as the needs of the design system grows.
 */
function useEarthPalette({ count, hue }: IUseColorPalette) {
  const range = {
    s: { min: 36, max: 41 },
    l: { min: 36, max: 77 }
  };
  return generatePalette({ count, hue, range, tone: EColorTone.Earth });
}
function useFluorescentPalette({ count, hue }: IUseColorPalette) {
  const range = {
    s: { min: 63, max: 100 },
    l: { min: 82, max: 100 }
  };
  return generatePalette({ count, hue, range, tone: EColorTone.Fluorescent });
}
function useJewelPalette({ count, hue }: IUseColorPalette) {
  const range = {
    s: { min: 73, max: 83 },
    l: { min: 56, max: 76 }
  };
  return generatePalette({ count, hue, range, tone: EColorTone.Jewel });

}
function useNeutralPalette({ count, hue }: IUseColorPalette) {
  const range = {
    s: { min: 1, max: 10 },
    l: { min: 70, max: 90 }
  }
  return generatePalette({ count, hue, range, tone: EColorTone.Neutral });
};
function usePastelPalette({ count, hue }: IUseColorPalette) {
  const range = {
    s: { min: 14, max: 21 },
    l: { min: 89, max: 96 }
  };
  return generatePalette({ count, hue, range, tone: EColorTone.Pastel });
}
function useShadesPalette({ count, hue }: IUseColorPalette) {
  const range = {
    s: { min: 0, max: 0 },
    l: { min: 0, max: 100 }
  };
  return generatePalette({ count, hue, range, tone: EColorTone.Shades });
};

export function useColorPalette() {
  return {
    useEarthPalette,
    useFluorescentPalette,
    useJewelPalette,
    useNeutralPalette,
    usePastelPalette,
    useShadesPalette
  };
}

interface IGeneratePalette extends IUseColorPalette {
  count?: number;
  range: IHslRange,
  tone: EColorTone
}
enum EColorTone {
  Earth,
  Fluorescent,
  Jewel,
  Neutral,
  Pastel,
  Shades
}
interface IUseColorPalette {
  hue: number
  count?: number;
}
interface IHslRange {
  s: { min: number; max: number };
  l: { min: number; max: number };
}