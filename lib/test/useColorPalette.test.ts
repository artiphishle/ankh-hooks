#!/usr/bin/env node

import test from "node:test";
import assert from "node:assert";
import { useColorPalette } from "../hooks/color/useColorPalette";
import { act, renderHook } from "@testing-library/react";
import { EAnkhColorTone, type IAnkhColorHsl } from "ankh-types";

test("returns correct used color tone 'earth'", (t) => {
  const colors: IAnkhColorHsl[] = [
    { h: 0, s: 41, l: 77 },
    { h: 120, s: 41, l: 77 },
    { h: 240, s: 41, l: 77 }
  ];
  const { result } = renderHook(() => useColorPalette());
  const tone = result.current.getUsedColorTone(colors);
  assert(tone === EAnkhColorTone.Earth);
});

test("returns correct used color tone 'fluorescent'", (t) => {
  const colors: IAnkhColorHsl[] = [
    { h: 50, s: 63, l: 82 },
    { h: 170, s: 63, l: 82 },
    { h: 290, s: 63, l: 82 }
  ];
  const { result } = renderHook(() => useColorPalette());
  const tone = result.current.getUsedColorTone(colors);
  assert(tone === EAnkhColorTone.Fluorescent);
});

test("returns correct used color tone 'jewel'", (t) => {
  const colors: IAnkhColorHsl[] = [
    { h: 50, s: 83, l: 76 },
    { h: 170, s: 83, l: 76 },
    { h: 290, s: 83, l: 76 }
  ];
  const { result } = renderHook(() => useColorPalette());
  const tone = result.current.getUsedColorTone(colors);
  assert(tone === EAnkhColorTone.Jewel);
});

test("returns correct used color tone 'neutral'", (t) => {
  const colors: IAnkhColorHsl[] = [
    { h: 50, s: 1, l: 70 },
    { h: 170, s: 1, l: 70 },
    { h: 290, s: 1, l: 70 }
  ];
  const { result } = renderHook(() => useColorPalette());
  const tone = result.current.getUsedColorTone(colors);
  assert(tone === EAnkhColorTone.Neutral);
});

test("returns correct used color tone 'pastel'", (t) => {
  const colors: IAnkhColorHsl[] = [
    { h: 50, s: 21, l: 96 },
    { h: 170, s: 21, l: 96 },
    { h: 290, s: 21, l: 96 }
  ];
  const { result } = renderHook(() => useColorPalette());
  const tone = result.current.getUsedColorTone(colors);
  assert(tone === EAnkhColorTone.Pastel);
});

test("returns correct used color tone 'shade'", (t) => {
  const colors: IAnkhColorHsl[] = [
    { h: 50, s: 0, l: 100 },
    { h: 170, s: 0, l: 100 },
    { h: 290, s: 0, l: 100 }
  ];
  const { result } = renderHook(() => useColorPalette());
  const tone = result.current.getUsedColorTone(colors);
  assert(tone === EAnkhColorTone.Shades);
});

test("returns correct used color tone 'custom'", (t) => {
  const colors: IAnkhColorHsl[] = [
    { h: 285, s: 79, l: 24 },
    { h: 32, s: 22, l: 53 },
    { h: 37, s: 71, l: 89 },
    { h: 300, s: 14, l: 4 },
    { h: 0, s: 0, l: 98 }
  ];
  const { result } = renderHook(() => useColorPalette());
  const tone = result.current.getUsedColorTone(colors);
  assert(tone === EAnkhColorTone.Custom);
});

/*
test("returns valid Pastel Tone color in HSL", () => {
  const { result } = renderHook(() => useColorPalette());
});
*/