#!/usr/bin/env node

import test from "node:test";
import assert from "node:assert";
import { useColorConverter } from "../hooks/color/useColorConverter";

test("converts rgb to hex correctly", () => {
  const { rgbToHex } = useColorConverter();
  const tests = ["rgb(0,0,0)", "rgb(255, 31, 22)", "rgb(14, 222, 141)"];
  const expecteds = ["#000000", "#ff1f16", "#0ede8d"];

  tests.forEach((rgb, testIndex) => {
    const received = rgbToHex(rgb);
    assert(received === expecteds[testIndex]);
  });
});
test("converts rgbA to hexA correctly", () => {
  const { rgbaToHexA } = useColorConverter();
  const tests = ["rgba(0,0,0,.5)", "rgba(255, 31, 22, .3)", "rgba(14, 222, 141, 1)"];
  const expecteds = ["#00000050", "#ff1f1630", "#0ede8d"];

  tests.forEach((rgbA, testIndex) => {
    const received = rgbaToHexA(rgbA);
    assert(received === expecteds[testIndex]);
  });
});
test("converts rgb to hsl correctly", () => {
  const { rgbToHsl } = useColorConverter();
  const tests = ["rgb(0, 0, 0)", "rgb(255, 255, 255)", "rgb(31, 22, 155)"];
  const expecteds = ["hsl(0, 0, 0)", "hsl(0, 0, 100)", "hsl(244.06015037593986, 75.14124293785311, 34.705882352941174)"];

  tests.forEach((rgb, testIndex) => {
    const received = rgbToHsl(rgb);
    assert(received === expecteds[testIndex]);
  });
});
test("converts lch to lab correctly", () => {
  const { lchToLab } = useColorConverter();
  const tests = ["lch(2, 2, 2)", "lch(5,20,50)", "lch(80,40,40)"];
  /** @todo Double-check this results and find out about rounding */
  const expecteds = ["lab(2, 1.9987816540395795, 0.06979899336525298)", "lab(5, 12.855752201347793, 15.320888855988134)", "lab(80, 30.641777734985407, 25.71150437527436)"];

  tests.forEach((lch, testIndex) => {
    const received = lchToLab(lch);
    assert(received === expecteds[testIndex]);
  });
});
test("converts xyz to lab correctly", () => {
  const { xyzToLab } = useColorConverter();
  const tests = ["xyz(1,2,3)", "xyz(20,20,20)", "xyz(50,50,50)"];
  /** @todo Double-check this results and find out about rounding */
  const expecteds = ["lab(15.48724439356052, -26.15957502418288, -6.118154353509009)", "lab(51.83721156293174, 4.993364781034848, 3.2713111902976655)", "lab(76.06926103542808, 6.777038661792911, 4.439852360797958)"];

  tests.forEach((xyz, testIndex) => {
    const received = xyzToLab(xyz);
    assert(received === expecteds[testIndex]);
  });
});
test("converts lab to lch correctly", () => {
  const { labToLch } = useColorConverter();
  const tests = ["lab(20,20,20)", "lab(0, 0, 0)", "lab(-100, -125, -125)"];
  /** @todo Double-check this results and find out about rounding */
  const expecteds = ["lch(20, 28.284271247461902, 45)", "lch(0, 0, 360)", "lch(-100, 176.7766952966369, 225)"];

  tests.forEach((lab, testIndex) => {
    const received = labToLch(lab);
    assert(received === expecteds[testIndex]);
  });
});
test("converts hex to rgb correctly", () => {
  const { hexToRgb } = useColorConverter();
  const tests = ["#000000", "#FF00FF", "#8bcdEF"];
  const expecteds = ["rgb(0, 0, 0)", "rgb(255, 0, 255)", "rgb(139, 205, 239)"];

  tests.forEach((hex, testIndex) => {
    const received = hexToRgb(hex);
    assert(received === expecteds[testIndex]);
  });
});
test("converts hsl to rgb correctly", () => {
  const { hslToRgb } = useColorConverter();
  const tests = ["hsl(0,50,50)", "hsl(180,0,0)", "hsl(50, 20, 80)"];
  /** @todo Double-check this results and find out about rounding */
  const expecteds = ["rgb(191.25, 63.75, 63.75)", "rgb(0, 0, 0)", "rgb(214.2, 210.8, 193.80000000000004)"];

  tests.forEach((hsl, testIndex) => {
    const received = hslToRgb(hsl);
    assert(received === expecteds[testIndex]);
  });
});
test("converts xyz to rgb correctly", () => {
  const { xyzToRgb } = useColorConverter();
  const tests = ["xyz(20, 20, 20)", "xyz(20, 20, 20)", "xyz(12, 20, 48)"];
  /** @todo Double-check this results and find out about rounding */
  const expecteds = ["rgb(134.66087137899075, 120.55120578676606, 118.1746653608519)", "rgb(134.66087137899075, 120.55120578676606, 118.1746653608519)", "rgb(-520.2041616, 143.9805761889637, 182.95014893323383)"];

  tests.forEach((xyz, testIndex) => {
    const received = xyzToRgb(xyz);
    assert(received === expecteds[testIndex]);
  });
});
test("converts lab to xyz correctly", () => {
  const { labToXyz } = useColorConverter();
  const tests = ["lab(50, 50, 50)", "lab(0, 0, 0)", "lab(90, 100, 100)"];
  /** @todo Double-check this results and find out about rounding */
  const expecteds = ["xyz(28.45441162196072, 18.418651851244416, 3.5333876177528816)", "xyz(5.89248204531318e-9, 6.199545535696214e-9, 6.750251165632109e-9)", "xyz(131.32638417110175, 76.30335397105253, 7.714536225347496)"];

  tests.forEach((lab, testIndex) => {
    const received = labToXyz(lab);
    assert(received === expecteds[testIndex]);
  });
});
test("converts rgb to xyz correctly", () => {
  const { rgbToXyz } = useColorConverter();
  const tests = ["rgb(255,255,255)", "rgb(0, 0, 0)", "rgb(255, 0, 0)"];
  /** @todo Double-check this results and find out about rounding */
  const expecteds = ["xyz(95.05, 100, 108.89999999999999)", "xyz(0, 0, 0)", "xyz(41.24, 21.26, 1.9300000000000002)"];

  tests.forEach((rgb, testIndex) => {
    const received = rgbToXyz(rgb);
    assert(received === expecteds[testIndex]);
  });
});