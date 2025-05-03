export const invalidArgsMessage = (argsLength): string => {
  return `Wrong number of arguments to IF. 
    Expected between 2 and 4 arguments, but got ${argsLength} arguments.`;
};

export const areArgsValid = (args): boolean => {
  return args && (args.length === 2 || args.length === 3);
};

export var collectValuesFunc = (result: number[] | null, value: number | Number): number[] => {
  if (result === null) {
    result = [];
  }
  result.push(value.valueOf());
  return result;
};
export var sumFunc = (
  a: number | Number,
  b: number | Number
): Number => {
  return new Number(a.valueOf() + b.valueOf());
};

export var incrementFunc = (
  a: number | Number
): Number => {
  return new Number(a.valueOf() + 1);
};

