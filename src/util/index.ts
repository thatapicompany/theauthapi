import isString from "lodash.isstring";

export function validateString(variableName: string, value: string) {
    if (!value || !isString(value)) {
      throw new Error(`${variableName} must be a string`);
    }
}