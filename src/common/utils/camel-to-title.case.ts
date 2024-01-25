export const camelToTitle = (input: string) => {
  const stringInArray = input.split(/(?=[A-Z])/);
  const captalizeArray = stringInArray.map((value) => (value = value.charAt(0).toUpperCase() + value.substring(1)));
  return captalizeArray.join(" ");
};
