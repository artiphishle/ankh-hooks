# Ankhorage Hooks

This is a library of hooks (functions) covering different categories.

## Color

Collection of hooks related to color

### useColorContrast()

By default the contrast will be rounded to 2 decimals but you can change this as a third param.

```ts
const { useColorContrastFromHex } = useColorContrast();

useColorContrastFromHex("#767676", "#ffffff");
// Output: 4.54

useColorContrastFromHex("#abcdef", "#fbcdaa", 4);
// Output: 1.1341
```

### useColorConverter()

Documentation to follow

### useColorHelper()

Documentation to follow

### useColorHues()

Documentation to follow

### useColorLuminance()

Documentation to follow

### useColorPalette()

Documentation to follow

### useColorParser()

Documentation to follow

### useColorValidator()

Documentation to follow

## FS

### useDirectory()

Documentation to follow

### useLanguageDetection()

Documentation to follow

## MDD

Metric driven design

### useError()

Enable logging will `useLogging` to either write a log to a provide API (C)rud Create function or if not provided `console.log()`.

```ts
const { useFatalError } = useError();

useFatalError("Something went wrong!", {enableLogging: true});"
```

### useLogging()

```ts
const { writeLog } = useAnkhLogging();
```

## Static

Static file handling

### useSvg()

Dynamically load an SVG icon

```ts
const SvgComponent = useSvg("house");
```
