export const toTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};
