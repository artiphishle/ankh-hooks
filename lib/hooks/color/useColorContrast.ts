import { useColorConverter } from "@/hooks/color/useColorConverter";
import { useColorLuminance } from "@/hooks/color/useColorLuminance";
import { useColorParser } from "./useColorParser";

/**
  * Contrast ratio by luminance of two colors
  * TODO atm it's by HEX but use other hooks and only calc from luminance
  * @inspiredBy Alvaro Montoro
  * @todo Remove exclam hacks
  * @url{https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o}
  */
function useColorContrastFromHex(hex1: string, hex2: string, fix = 2) {
  const { hexToRgb } = useColorConverter();
  const { parseRgb } = useColorParser();

  const [l1, l2] = [hex1, hex2]
    .map((hex) => hexToRgb(hex))
    .map((rgb) => parseRgb(rgb))
    .map(([r, g, b]) => useColorLuminance(r!, g!, b!));

  return parseFloat((
    l1! > l2! ? (l1! + 0.05) / (l2! + 0.05) : (l2! + 0.05) / (l1! + 0.05)
  ).toFixed(fix));
}

export function useColorContrast() {
  return { useColorContrastFromHex };
}