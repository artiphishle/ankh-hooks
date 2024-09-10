import { useEffect, useState } from "react";
import { useError } from "../mdd";

export function useSvg(filePath: string) {
  const { useFatalError } = useError();
  const [svg, setSvg] = useState<string>();

  useEffect(() => {
    async function fetchSvg() {
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw response.text;
        const svgText = await response.text();
        setSvg(svgText);
      } catch (error: any) {
        useFatalError(`Cannot load SVG '${name}': ${error}`);
      }
    }
    fetchSvg();
  }, []);

  return { svg };
}