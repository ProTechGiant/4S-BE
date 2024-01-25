export const camelToSnake = (input: string) => {
  const stringInArray = input.split(/(?=[A-Z])/);
  const lowerCaseArray = stringInArray.map((value) => (value = value.toLowerCase()));
  return lowerCaseArray.join("_");
};
