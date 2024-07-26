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
import { IAnkhColorTone } from "ankh-types";

/** @tone Jewel */
const JewelTone: IAnkhColorTone = {
  saturation: { min: 73, max: 83 },
  brightness: { min: 56, max: 76 }
};

/** @tone Pastel */
const PastelTone: IAnkhColorTone = {
  saturation: { min: 14, max: 21 },
  brightness: { min: 89, max: 96 }
};

/** @tone Earth */
const EarthTone: IAnkhColorTone = {
  saturation: { min: 36, max: 41 },
  brightness: { min: 36, max: 77 }
};

/** @tone Neutral */
const NeutralTone: IAnkhColorTone = {
  saturation: { min: 1, max: 10 },
  brightness: { min: 70, max: 99 }
};

/** @tone Fluorescent */
const FluorescentTone: IAnkhColorTone = {
  saturation: { min: 63, max: 100 },
  brightness: { min: 82, max: 100 }
};

/** @tone Shades */
const ShadeTone: IAnkhColorTone = {
  saturation: { min: 0, max: 0 },
  brightness: { min: 0, max: 100 }
};