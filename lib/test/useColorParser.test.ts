#!/usr/bin/env node

import test from "node:test";
import assert from "node:assert";
import { useColorParser } from "../hooks/color/useColorParser";

test("parses hex strings correctly", () => {
  const { parseHex } = useColorParser();
  const tests = ["#FFFFFF", "#AEb22f"];
  const expecteds = ["#ffffff", "#aeb22f"]

  tests.forEach((hexString, testIndex) => {
    const received = parseHex(hexString);
    const expected = expecteds[testIndex]!;
    assert(received === expected);
  })
});

test("parses hsl strings correctly", () => {
  const { parseHsl } = useColorParser();
  const tests = ["hsl(120, 20%, 20%)", "hsl(55, 40, 40)"];
  const expecteds = [[120, 20, 20], [55, 40, 40]]

  tests.forEach((hslString, testIndex) => {
    const received = parseHsl(hslString);
    const expected = expecteds[testIndex]!;

    received.forEach((r, rIndex) => {
      assert(r === expected[rIndex]);
    });
  });
});

test("parses lab strings correctly", () => {
  const { parseLab } = useColorParser();
  const tests = ["lab(80, -40, 50)", "lab(-80, -100, -80)"];
  const expecteds = [[80, -40, 50], [-80, -100, -80]]

  tests.forEach((labString, testIndex) => {
    const received = parseLab(labString);
    const expected = expecteds[testIndex]!;

    received.forEach((r, rIndex) => {
      assert(r === expected[rIndex]);
    });
  });
});

test("@todo: parses lch strings correctly", () => {
  const { parseLch } = useColorParser();
  /*
  const tests = [];
  const expecteds = [];

  tests.forEach((lchString, testIndex) => {
    const received = parseLch(lchString);
    const expected = expecteds[testIndex]!;

    received.forEach((r, rIndex) => {
      assert(r === expected[rIndex]);
    });
  });
  */
});

test("parses rgb strings correctly", () => {
  const { parseRgb } = useColorParser();
  const tests = ["rgb(0, 255, 255)", "rgb(55, 0, 0)"];
  const expecteds = [[0, 255, 255], [55, 0, 0]]

  tests.forEach((rgbString, testIndex) => {
    const received = parseRgb(rgbString);
    const expected = expecteds[testIndex];

    received.forEach((r, rIndex) => {
      assert(r === expecteds[testIndex]![rIndex]);
    });
  });
});

test("parses rgbA strings correctly", () => {
  const { parseRgbA } = useColorParser();
  const tests = ["rgba(255,255,255,0.5)", "rgba(0, 0, 0, 0.8)"];
  const expecteds = [[255, 255, 255, 0.5], [0, 0, 0, 0.8]];

  tests.forEach((rgbaString, testIndex) => {
    const received = parseRgbA(rgbaString);
    const expected = expecteds[testIndex]!;

    received.forEach((r, rIndex) => {
      assert(r === expected[rIndex]);
    });
  });
});

test("@todo: parses xyz strings correctly", () => {
  const { parseXyz } = useColorParser();
  /*
  const tests = [];
  const expecteds = [];

  tests.forEach((xyzString, testIndex) => {
    const received = parseXyz(xyzString);
    const expected = expecteds[testIndex];

    received.forEach((r, rIndex) => {
      assert(r === expecteds[testIndex]![rIndex]);
    });
  });
  */
});