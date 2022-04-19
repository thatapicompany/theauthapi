import isString from "lodash.isstring";

export function validateString(variableName: string, value: string) {
    if (!value || !isString(value)) {
      throw new TypeError(`${variableName} must be a string, got: ${value}`);
    }
}