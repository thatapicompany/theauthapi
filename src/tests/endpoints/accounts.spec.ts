import TheAuthAPI from '../../index';
import { Server } from 'http';
import testServer from '../testServer/server';

const port = 4063;

const createClient = (options?: any) => {
  options = Object.assign(
    {
      host: `http://localhost:${port}`,
    },
    options,
  );
  return new TheAuthAPI('access_key', options);
};

describe('Accounts', () => {
  let server: Server;
  beforeAll(() => {
    server = testServer.listen(port);
  });

  afterAll(() => {
    server.close();
  });
  it('should get an account using accountId', async () => {
    const client = createClient();
    const account = await client.accounts.getAccount(
      'bc3be201-f34b-4278-9f19-4e28ebee2561',
    );
    expect(account).toEqual(
      expect.objectContaining({
        isActive: true,
        createdBy: 'b8264e32-69e7-4980-8afe-19c0559badba',
        updatedAt: new Date('2022-04-06T23:25:16.391Z'),
        createdAt: new Date('2022-04-06T23:25:16.391Z'),
        id: 'bc3be201-f34b-4278-9f19-4e28ebee2561',
        name: 'my first auth account',
      }),
    );
  });
});
