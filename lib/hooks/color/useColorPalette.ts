"use client";
import { useEffect, useState } from "react";

const generateHslColor = ({ hue, saturation, lightness }: IHslRange) => {
  const s = Math.random() * (saturation[1] - saturation[0]) + saturation[0];
  const l = Math.random() * (lightness[1] - lightness[0]) + lightness[0];
  return `hsl(${hue}, ${s}% ${l}%)`;
}

export function useColorPalette(hslRange: IHslRange, count: number) {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const newColors = Array.from({ length: count }, () => generateHslColor(hslRange));
    setColors(newColors);
  }, []);

  return colors;
}

interface IHslRange {
  hue: number;
  saturation: [number, number];
  lightness: [number, number]
}