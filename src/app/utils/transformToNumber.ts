export const transformToNumber = (value: string | number) => {
  if (typeof value === 'string') {
    return parseInt(value);
  } else {
    return value;
  }
};
