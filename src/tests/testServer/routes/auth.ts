import { Router } from 'express';

const router = Router();

export const authRoutes = router.post('/authenticate', (request, response) => {
  const { credentials } = request.body;
  if (!credentials || !credentials.api_key) {
    return response.json({
      message: 'missing api_key',
    });
  }
  if (credentials.api_key.length !== 32) {
    return response.json({
      message: 'api_key must have a length of 32',
    });
  }

  return response.json({
    customMetaData: {},
    customAccountId: 'acc-id',
    customUserId: 'my-user-id',
    authenticated: true,
  });
});
