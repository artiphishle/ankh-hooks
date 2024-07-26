#!/usr/bin/env node

import test from "node:test";
import assert from "node:assert";
import { useColorContrast } from "../hooks/color/useColorContrast";

test("calculates correct contrast rounded to 2 decimals", () => {
  const { useColorContrastFromHex } = useColorContrast();
  const tests: Array<[string, string]> = [
    ["#000000", "#ffffff"],
    ["#767676", "#ffffff"]
  ];
  const expecteds = [21, 4.54];

  tests.forEach((hexValues, testIndex) => {
    const received = useColorContrastFromHex(hexValues[0], hexValues[1]);
    const expected = expecteds[testIndex];
    assert(received === expected);
  });
});

test("calculates correct contrast rounded to 4 decimals", () => {
  const { useColorContrastFromHex } = useColorContrast();
  const tests: Array<[string, string]> = [
    ["#222222", "#c1c2c5"],
    ["#abcdef", "#fbcdaa"]
  ];
  const expecteds = [8.9327, 1.1341];

  tests.forEach((hexValues, testIndex) => {
    const received = useColorContrastFromHex(hexValues[0], hexValues[1], 4);
    const expected = expecteds[testIndex];
    console.log(received, expected);
    assert(received === expected);
  });
});