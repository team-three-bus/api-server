export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== "number" && value === "") {
    return true;
  } else if (typeof value === "undefined" || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === "object" &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

export const sortObj = (obj: Object): Object => {
  return Object.entries(obj)
    .sort(([,a],[,b]) => a + b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
};