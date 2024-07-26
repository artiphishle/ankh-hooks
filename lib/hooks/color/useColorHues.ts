import { EAnkhColorUnit, IAnkhColor } from "@/hooks/color/types";
import { useColorConverter } from "./useColorConverter";
import { useColorParser } from "./useColorParser";

function genHues({ colorValue, colorUnit = EAnkhColorUnit.Lab, hueCount = 9, step = 20 }: IAnkhUseColorHueOptions) {
  const { hexToLab, hslToLab, rgbToLab } = useColorConverter();
  const { parseLab } = useColorParser();

  const hues: IAnkhColor[] = new Array(hueCount).fill("");
  const base = Math.floor(hueCount / 2);
  const [l, a, b] = parseLab(colorValue);

  return hues.map((_, hueIndex) => {
    if (hueIndex === base) return `lab(${l} ${a} ${b})`;
    const direction = hueIndex < base ? -1 : 1;
    let delta = ((base - hueIndex) * step) * direction;
    if (delta > 100) delta = 100;
    if (delta < -100) delta = -100;

    const lab = `lab(${l! + delta} ${a} ${b})`;
    /** @todo convert to expected param 'colorUnit' */
    return lab;
  })
}

export function useColorHues() {
  return { genHues }
}

interface IAnkhUseColorHueOptions {
  readonly colorValue: IAnkhColor["value"];
  readonly colorUnit?: EAnkhColorUnit;
  readonly hueCount?: number;
  readonly step?: number;
}