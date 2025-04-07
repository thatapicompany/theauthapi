/**
 *
 *  Throws when the server responds with a status code that falls out of the range 2xx
 *  @param statusCode - HTTP status code the server responded with
 *  @param message - error message
 *
 * */
class ApiResponseError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(`(${statusCode}): ${message}`);
    this.statusCode = statusCode;
    this.name = 'ApiResponseError';
  }
}

export default ApiResponseError;
