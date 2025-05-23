import { EAnkhColorTone, type IAnkhColorHsl } from "ankh-types"

enum EAnkhColorSeverity {
  Error = 0,
  Info = 1,
  Success = 2,
  Warn = 3,
}
enum EAnkhColorSemanticName {
  Primary = "primary",
  Secondary = "secondary",
  Accent = "accent",
  Base = "base",
}
enum EAnkhColorToneCombination {
  EarthAndNeutral = 0,
  EarthAndPastel = 1,
  FluorescentAndShades = 2,
  JewelAndPastel = 3,
  ShadesAndPastel = 4,
}
interface IAnkhColorRules {
  combination: any
  tone: Record<Exclude<EAnkhColorTone, EAnkhColorTone.Custom>, any>
  severity: Record<EAnkhColorSeverity, any>
}

const rules: IAnkhColorRules = {
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
    [EAnkhColorSeverity.Warn]: { h: { min: 0, max: 0 } },
  },
}

const generateHslColor = ({ hue, range }: any) => {
  const { s, l } = range
  const realHue = Math.floor(Math.random() * 360)
  const saturation = Math.random() * (s.max - s.min) + s.min
  const lightness = Math.random() * (l.max - l.min) + l.min
  return `hsl(${realHue}, ${saturation}% ${lightness}%)`
}
function generatePalette({ count = 4, hue, range }: IGeneratePalette) {
  return new Array(count).fill({ hue, range }).map(() => generateHslColor({ hue, range }))
}

/*
function usePaletteCreator({ config }: IUsePaletteCreator) {
  const { hues, tones } = config;

  const a = hues.map((hue) => {
    return tones.map(({ tone, saturation, lightness }) => {
      return tone
    })
  })
}
*/

function useColorRules() {
  return rules
}

function getUsedColorTone(colors: IAnkhColorHsl[]) {
  const EARTH_RULES = rules.tone[EAnkhColorTone.Earth]
  const FLUORESCENT_RULES = rules.tone[EAnkhColorTone.Fluorescent]
  const JEWEL_RULES = rules.tone[EAnkhColorTone.Jewel]
  const NEUTRAL_RULES = rules.tone[EAnkhColorTone.Neutral]
  const PASTEL_RULES = rules.tone[EAnkhColorTone.Pastel]
  const SHADE_RULES = rules.tone[EAnkhColorTone.Shades]

  function getUsedTone({ s, l }: { s: number; l: number }) {
    if (s >= EARTH_RULES.s.min && s <= EARTH_RULES.s.max && l >= EARTH_RULES.l.min && l <= EARTH_RULES.l.max)
      return EAnkhColorTone.Earth
    if (
      s >= FLUORESCENT_RULES.s.min &&
      s <= FLUORESCENT_RULES.s.max &&
      l >= FLUORESCENT_RULES.l.min &&
      l <= FLUORESCENT_RULES.l.max
    )
      return EAnkhColorTone.Fluorescent
    if (s >= JEWEL_RULES.s.min && s <= JEWEL_RULES.s.max && l >= JEWEL_RULES.l.min && l <= JEWEL_RULES.l.max)
      return EAnkhColorTone.Jewel
    if (s >= NEUTRAL_RULES.s.min && s <= NEUTRAL_RULES.s.max && l >= NEUTRAL_RULES.l.min && l <= NEUTRAL_RULES.l.max)
      return EAnkhColorTone.Neutral
    if (s >= PASTEL_RULES.s.min && s <= PASTEL_RULES.s.max && l >= PASTEL_RULES.l.min && l <= PASTEL_RULES.l.max)
      return EAnkhColorTone.Pastel
    if (s >= SHADE_RULES.s.min && s <= SHADE_RULES.s.max && l >= SHADE_RULES.l.min && l <= SHADE_RULES.l.max)
      return EAnkhColorTone.Shades
    return EAnkhColorTone.Custom
  }

  const tones = colors.map((color) => getUsedTone(color))
  if (tones.includes(EAnkhColorTone.Custom)) return EAnkhColorTone.Custom

  const filtered = tones.filter((tone) => tone === tones[0])
  if (filtered.length === colors.length) return filtered[0] as EAnkhColorTone
  return EAnkhColorTone.Custom
}

function useEarthPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Earth]
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Earth })
}
function useFluorescentPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Fluorescent]
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Fluorescent })
}
function useJewelPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Jewel]
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Jewel })
}
function useNeutralPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Neutral]
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Neutral })
}
function usePastelPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Pastel]
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Pastel })
}
function useShadesPalette({ count, hue }: IUseColorPalette) {
  const range = rules.tone[EAnkhColorTone.Shades]
  return generatePalette({ count, hue, range, tone: EAnkhColorTone.Shades })
}

export function useColorPalette() {
  return {
    getUsedColorTone,
    useColorRules,
    useEarthPalette,
    useFluorescentPalette,
    useJewelPalette,
    useNeutralPalette,
    usePastelPalette,
    useShadesPalette,
  }
}

interface IGeneratePalette extends IUseColorPalette {
  range: IHslRange
  tone: EAnkhColorTone
  count?: number
}
interface IUseColorPalette {
  hue: number
  count?: number
}
interface IHslRange {
  s: { min: number; max: number }
  l: { min: number; max: number }
}

interface IUsePaletteCreator {
  config: {
    hues: number[]
    tones: {
      tone: EAnkhColorTone
      saturation: number
      lightness: number
    }[]
  }
}
