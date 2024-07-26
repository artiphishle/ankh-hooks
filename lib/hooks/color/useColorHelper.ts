function useNumValues(colorValue: string) {
  // Matches hex|hsl|lab|rgb css strings
  const regMatchColor = /^[a-z]{3}\((-?[\d\.]+%?),? ?(-?[\d\.]+%?),? ?(-?[\d\.]+%?)\)$/;

  try {
    /** @todo separate all color units to define better regex */
    const numArray =
      colorValue.match(regMatchColor)?.slice(1) || [];
    return numArray.map((num: string) => parseInt(num, 10));
  } catch (error: any) {
    throw new Error(colorValue);
  }
}

export function useColorHelper() {
  return { useNumValues };
}