import { Request, Response, NextFunction } from 'express';
import { version } from '../../../libraryMeta';

export function headersMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const accessKey = request.header('x-api-key');
  if (!accessKey) {
    return response.status(400).json({
      message: 'missing access key',
    });
  }
  if (request.header('user-agent') !== `theauthapi-client-node/${version}`) {
    return response.status(400).json({
      message: 'invalid user-agent',
    });
  }
  next();
}
