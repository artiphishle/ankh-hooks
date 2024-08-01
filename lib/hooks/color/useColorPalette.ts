import { EAnkhColorTone } from "ankh-types";

enum EAnkhColorSeverity {
  Error,
  Info,
  Success,
  Warn
}

enum EAnkhColorSemanticName {
  Primary = 'primary',
  Secondary = 'secondary',
  Accent = 'accent',
  Base = 'base'
}
enum EAnkhColorToneCombination {
  EarthAndNeutral,
  EarthAndPastel,
  FluorescentAndShades,
  JewelAndPastel,
  ShadesAndPastel,
}

const rules = {
  combination: {
    [EAnkhColorToneCombination.EarthAndNeutral]: {
      [EAnkhColorSemanticName.Primary]: { tone: EAnkhColorTone.Earth },
      [EAnkhColorSemanticName.Secondary]: { tone: EAnkhColorTone.Earth },
      [EAnkhColorSemanticName.Accent]: { tone: EAnkhColorTone.Neutral },
      [EAnkhColorSemanticName.Base]: { tone: EAnkhColorTone.Neutral },
    },
    [EAnkhColorToneCombination.EarthAndPastel]: {
      [EAnkhColorSemanticName.Primary]: { tone: EAnkhColorTone.Earth },
      [EAnkhColorSemanticName.Secondary]: { tone: EAnkhColorTone.Earth },
      [EAnkhColorSemanticName.Accent]: { tone: EAnkhColorTone.Neutral },
      [EAnkhColorSemanticName.Base]: { tone: EAnkhColorTone.Neutral },
    },
    [EAnkhColorToneCombination.FluorescentAndShades]: {
      [EAnkhColorSemanticName.Primary]: { tone: EAnkhColorTone.Fluorescent },
      [EAnkhColorSemanticName.Secondary]: { tone: EAnkhColorTone.Fluorescent },
      [EAnkhColorSemanticName.Accent]: { tone: EAnkhColorTone.Shades },
      [EAnkhColorSemanticName.Base]: { tone: EAnkhColorTone.Shades },
    },
    [EAnkhColorToneCombination.JewelAndPastel]: {
      [EAnkhColorSemanticName.Primary]: { tone: EAnkhColorTone.Jewel },
      [EAnkhColorSemanticName.Secondary]: { tone: EAnkhColorTone.Jewel },
      [EAnkhColorSemanticName.Accent]: { tone: EAnkhColorTone.Pastel },
      [EAnkhColorSemanticName.Base]: { tone: EAnkhColorTone.Pastel },
    },
    [EAnkhColorToneCombination.ShadesAndPastel]: {
      [EAnkhColorSemanticName.Primary]: { tone: EAnkhColorTone.Shades },
      [EAnkhColorSemanticName.Secondary]: { tone: EAnkhColorTone.Shades },
      [EAnkhColorSemanticName.Accent]: { tone: EAnkhColorTone.Pastel },
      [EAnkhColorSemanticName.Base]: { tone: EAnkhColorTone.Pastel },
    },
  },
  tone: {
    [EAnkhColorTone.Earth]: { s: { min: 36, max: 41 }, l: { min: 36, max: 77 } },
    [EAnkhColorTone.Fluorescent]: { s: { min: 63, max: 100 }, l: { min: 82, max: 100 } },
    [EAnkhColorTone.Jewel]: { s: { min: 73, max: 83 }, l: { min: 56, max: 76 } },
    [EAnkhColorTone.Neutral]: { s: { min: 1, max: 10 }, l: { min: 70, max: 90 } },
    [EAnkhColorTone.Pastel]: { s: { min: 14, max: 21 }, l: { min: 89, max: 96 } },
    [EAnkhColorTone.Shades]: { s: { min: 0, max: 0 }, l: { min: 0, max: 100 } },
  },
  severity: {
    [EAnkhColorSeverity.Error]: { h: { min: 0, max: 119 } },
    [EAnkhColorSeverity.Info]: { h: { min: 0, max: 360 } },
    [EAnkhColorSeverity.Success]: { h: { min: 239, max: 360 } },
    [EAnkhColorSeverity.Warn]: { h: { min: 0, max: 0 } }
  }
};

const generateHslColor = ({ hue, range }: any) => {
  const { s, l } = range;
  const realHue = Math.floor(Math.random() * 360);
  const saturation = Math.random() * (s.max - s.min) + s.min;
  const lightness = Math.random() * (l.max - l.min) + l.min;
  return `hsl(${realHue}, ${saturation}% ${lightness}%)`;
}
function generatePalette({ count = 4, hue, range }: IGeneratePalette) {
  return new Array(count).fill({ hue, range }).map(() => generateHslColor({ hue, range }))
}

function usePaletteCreator({ config }: IUsePaletteCreator) {
  const { hues, tones } = config;

  const a = hues.map((hue) => {
    return tones.map(({ tone, saturation, lightness }) => {
      return tone
    })
  })
}

function useEarthPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Earth];
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Earth });
}
function useFluorescentPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Fluorescent];
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Fluorescent });
}
function useJewelPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Jewel];
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Jewel });
}
function useNeutralPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Neutral]
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Neutral });
};
function usePastelPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Pastel]
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Pastel });
}
function useShadesPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Shades];
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Shades });
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
  range: IHslRange,
  tone: EAnkhColorTone,
  count?: number;
}
interface IUseColorPalette {
  hue: number
  count?: number;
}
interface IHslRange {
  s: { min: number; max: number };
  l: { min: number; max: number };
}

interface IUsePaletteCreator {
  config: {
    hues: number[]
    tones: {
      tone: EAnkhColorTone;
      saturation: number;
      lightness: number;
    }[]
  }
}