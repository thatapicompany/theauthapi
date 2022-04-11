class ApiRequestError extends Error {
  constructor(statusCode: number, message: string) {
    super(`(${statusCode}): ${message}`);
  }
}

export default ApiRequestError;
