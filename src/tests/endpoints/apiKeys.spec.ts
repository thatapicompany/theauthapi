import TheAuthAPI from '../../index';
import testServer from '../testServer/server';
import { Server } from 'http';
import { shouldThrowError } from '../util';
import ApiResponseError from '../../services/ApiRequest/ApiResponseError';
import ApiKeys from '../../endpoints/ApiKeys/ApiKeys';

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

describe('ApiKeys', () => {
  let server: Server;
  beforeAll(() => {
    server = testServer.listen(port);
  });

  afterAll(() => {
    server.close();
  });

  it('should check if an apikey is valid', async () => {
    const client = createClient();
    const valid = await client.apiKeys.isValidKey(
      'live_access_zBA6cvuEbJEUhhDIWwuErXHLnwvWqtcqe2ajfV3RVVZvD6lc6xDUaSsSZL1fk53a',
    );
    const invalid = await client.apiKeys.isValidKey('invalid-key');
    expect(valid).toBeTruthy();
    expect(invalid).toBeFalsy();
    await shouldThrowError(
      () => client.apiKeys.isValidKey('$'),
      ApiResponseError,
    );
  });

  it('should get an apikey', async () => {
    const client = createClient();
    const data = await client.apiKeys.getKey(
      'live_access_zBA6cvuEbJEUhhDIWwuErXHLnwvWqtcqe2ajfV3RVVZvD6lc6xDUaSsSZL1fk53a',
    );
    expect(data.name).toEqual('My customers first Api Key');
    expect(data.key).toEqual(
      'KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH',
    );
    expect(data.createdAt).toEqual(new Date('2022-03-16T10:34:23.353Z'));
    expect(data.updatedAt).toEqual(new Date('2022-03-16T10:34:23.353Z'));
    expect(data.env).toEqual('live');
    expect(data.customAccountId).toEqual('acc-id');
  });

  it('should authenticate an apikey', async () => {
    const client = createClient();
    const data = await client.apiKeys.authenticateKey(
      'live_access_zBA6cvuEbJEUhhDIWwuErXHLnwvWqtcqe2ajfV3RVVZvD6lc6xDUaSsSZL1fk53a',
    );
    expect(data.name).toEqual('My customers first Api Key');
    expect(data.key).toEqual(
      'KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH',
    );
    expect(data.createdAt).toEqual(new Date('2022-03-16T10:34:23.353Z'));
    expect(data.updatedAt).toEqual(new Date('2022-03-16T10:34:23.353Z'));
    expect(data.env).toEqual('live');
    expect(data.customAccountId).toEqual('acc-id');
  });

  it('should list api keys', async () => {
    const client = createClient();
    const keys = await client.apiKeys.getKeys();
    expect(keys).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'live_h3uDZInxQexGLkwoxMDmuqz6PsyXGjkbrmSTpEwFb8l97mdAlQKtt14kt9Rv91PL',
          name: 'my-first-api-key',
          customMetaData: {},
          customAccountId: null,
          env: 'live',
        }),
        expect.objectContaining({
          key: 'live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM',
          name: 'my-second-api-key',
          customMetaData: {},
          customAccountId: null,
          env: 'live',
        }),
      ]),
    );
  });

  it('should filter api keys using many filters', async () => {
    const client = createClient();
    const keys = await client.apiKeys.getKeys({
      isActive: false,
      customAccountId: 'null',
      customUserId: 'USR123',
    });
    expect(keys).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM',
          name: 'my-second-api-key',
          customMetaData: {},
          customAccountId: null,
          customUserId: 'USR123',
          env: 'live',
          createdAt: new Date('2022-04-03T02:02:09.730Z'),
          updatedAt: new Date('2022-04-03T02:02:09.730Z'),
          isActive: false,
        }),
      ]),
    );
  });

  it('should filter api keys using one filter', async () => {
    const client = createClient();
    const keys = await client.apiKeys.getKeys({
      isActive: false,
    });
    expect(keys).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM',
          name: 'my-second-api-key',
          customMetaData: {},
          customAccountId: null,
          customUserId: 'USR123',
          env: 'live',
          createdAt: new Date('2022-04-03T02:02:09.730Z'),
          updatedAt: new Date('2022-04-03T02:02:09.730Z'),
          isActive: false,
        }),
      ]),
    );
  });

  it('should filter api keys using customUserId', async () => {
    const client = createClient();
    const keys = await client.apiKeys.getKeys({
      projectId: 'b52262b5-eaa6-4edd-825c-ebcdf76a10e5',
      customUserId: null,
    });
    expect(keys).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH',
          name: 'My customers first Api Key',
          customMetaData: {},
          customAccountId: 'acc-id',
          customUserId: null,
          env: 'live',
          createdAt: new Date('2022-03-16T10:34:23.353Z'),
          updatedAt: new Date('2022-03-16T10:34:23.353Z'),
          isActive: true,
        }),
      ]),
    );
  });

  it('should filter api keys using name', async () => {
    const client = createClient();
    const keys = await client.apiKeys.getKeys({
      projectId: 'b52262b5-eaa6-4edd-825c-ebcdf76a10e5',
      name: 'my-first-api-key',
    });
    expect(keys).toEqual([
      {
        key: 'live_h3uDZInxQexGLkwoxMDmuqz6PsyXGjkbrmSTpEwFb8l97mdAlQKtt14kt9Rv91PL',
        name: 'my-first-api-key',
        customMetaData: {},
        customAccountId: null,
        customUserId: 'USR123',
        env: 'live',
        createdAt: new Date('2022-04-03T01:59:32.051Z'),
        updatedAt: new Date('2022-04-03T01:59:32.051Z'),
        isActive: true,
      },
    ]);
  });

  it('should filter api keys using customAccountId', async () => {
    const client = createClient();
    const keys = await client.apiKeys.getKeys({
      projectId: 'b52262b5-eaa6-4edd-825c-ebcdf76a10e5',
      customAccountId: null,
    });
    expect(keys).toEqual([
      {
        key: 'live_h3uDZInxQexGLkwoxMDmuqz6PsyXGjkbrmSTpEwFb8l97mdAlQKtt14kt9Rv91PL',
        name: 'my-first-api-key',
        customMetaData: {},
        customAccountId: null,
        customUserId: 'USR123',
        env: 'live',
        createdAt: new Date('2022-04-03T01:59:32.051Z'),
        updatedAt: new Date('2022-04-03T01:59:32.051Z'),
        isActive: true,
      },
    ]);
  });

  it('should create a key', async () => {
    const client = createClient();
    const key = await client.apiKeys.createKey({
      name: 'my-new-api-key1',
      projectId: 'b52262b5-eaa6-4edd-825c-ebcdf76a10e5',
      customMetaData: {
        userType: 'BASIC',
      },
    });
    expect(key).toEqual(
      expect.objectContaining({
        key: 'live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM',
        name: 'my-new-api-key1',
        projectId: 'b52262b5-eaa6-4edd-825c-ebcdf76a10e5',
        env: 'live',
        customMetaData: {
          userType: 'BASIC',
        },
        isActive: true,
      }),
    );
  });

  it('should create a key without projectId', async () => {
    const client = createClient();
    const key = await client.apiKeys.createKey({
      name: 'my-new-api-key1',
    });
    expect(key).toEqual(
      expect.objectContaining({
        key: 'live_1OvRrfHbPdiCUrFAD4VwxiqEgg8L5uiVDlIgE4075juY7TnimZQG1Ll770irHyfM',
        name: 'my-new-api-key1',
        projectId: 'project10',
        env: 'live',
      }),
    );
  });

  it('should update a key', async () => {
    const client = createClient();
    const key = await client.apiKeys.updateKey(
      'live_TVHW0PVtktylIVObMd8J0sBHb7Ym3ZraObpeT3qxu7YRHig2KxrEIwggn50sBpSZ',
      {
        name: 'my-first-update-key',
      },
    );
    expect(key.name).toEqual('my-first-update-key');
    expect(key.key).toEqual(
      'live_h3uDZInxQexGLkwoxMDmuqz6PsyXGjkbrmSTpEwFb8l97mdAlQKtt14kt9Rv91PL',
    );
  });

  it('should rotate a key', async () => {
    const client = createClient();
    const key = await client.apiKeys.rotateKey(
      'live_TVHW0PVtktylIVObMd8J0sBHb7Ym3ZraObpeT3qxu7YRHig2KxrEIwggn50sBpSZ',
    );
    expect(key.key).not.toEqual(
      'live_TVHW0PVtktylIVObMd8J0sBHb7Ym3ZraObpeT3qxu7YRHig2KxrEIwggn50sBpSZ',
    );
  });

  it('should delete a key', async () => {
    const client = createClient();
    const response = await client.apiKeys.deleteKey(
      'live_TVHW0PVtktylIVObMd8J0sBHb7Ym3ZraObpeT3qxu7YRHig2KxrEIwggn50sBpSZ',
    );
    expect(response).toBeTruthy();
  });

  it('should reactivate a key', async () => {
    const client = createClient();
    const key = await client.apiKeys.reactivateKey(
      'live_TVHW0PVtktylIVObMd8J0sBHb7Ym3ZraObpeT3qxu7YRHig2KxrEIwggn50sBpSZ',
    );
    expect(key.name).toEqual('my-first-api-key');
    expect(key.key).toEqual(
      'live_h3uDZInxQexGLkwoxMDmuqz6PsyXGjkbrmSTpEwFb8l97mdAlQKtt14kt9Rv91PL',
    );
  });

  it('getKeysFilterEndpoint', async () => {
    const client = createClient();
    const apiKeys = client.apiKeys;
    expect(apiKeys['getKeysFilterEndpoint']()).toEqual('/api-keys/');
    expect(apiKeys['getKeysFilterEndpoint']({ projectId: '123' })).toEqual(
      '/api-keys/?projectId=123',
    );
    expect(apiKeys['getKeysFilterEndpoint']({ isActive: false })).toEqual(
      '/api-keys/?isActive=false',
    );
    expect(
      apiKeys['getKeysFilterEndpoint']({
        projectId: '123',
        customUserId: 'USR1',
        customAccountId: 'ACC1',
        isActive: true,
      }),
    ).toEqual(
      '/api-keys/?projectId=123&customUserId=USR1&customAccountId=ACC1&isActive=true',
    );
  });
});
