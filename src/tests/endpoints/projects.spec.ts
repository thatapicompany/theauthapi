import TheAuthAPI from '../../index';
import testServer from '../testServer/server';
import { Server } from 'http';
import { Environment } from '../../types';

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

describe('Projects', () => {
  let server: Server;
  beforeAll(() => {
    server = testServer.listen(port);
  });

  afterAll(() => {
    server.close();
  });

  it('should list all projects', async () => {
    const client = createClient();
    const projects = await client.projects.getProjects('project-id-1');
    expect(projects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          isActive: true,
          createdBy: 'user-id-1',
          createdByType: 'ACCESS_KEY',
          updatedAt: new Date('2022-04-05T21:42:58.054Z'),
          createdAt: new Date('2022-04-05T21:42:58.054Z'),
          id: 'project-id-1',
          name: 'My Auth Project',
          accountId: 'my-account-id',
          env: 'live',
        }),
      ]),
    );
  });

  it('should get a project using a projectId', async () => {
    const client = createClient();
    const project = await client.projects.getProject('project-id-2');
    expect(project).toEqual(
      expect.objectContaining({
        isActive: true,
        updatedAt: new Date('2022-04-02T21:02:14.808Z'),
        createdAt: new Date('2022-04-02T21:02:14.808Z'),
        id: 'project-id-2',
        name: 'Hulu',
        accountId: 'my-account-id-2',
        env: 'live',
      }),
    );
  });

  it('should delete a project', async () => {
    const client = createClient();
    const project = await client.projects.deleteProject('my-project-id');
    expect(project).toBeTruthy();
  });

  it('should create a project', async () => {
    const client = createClient();
    const project = await client.projects.createProject({
      name: 'test theauthapi project',
      accountId: 'my-account-id',
      env: Environment.TEST,
    });
    expect(project).toEqual(
      expect.objectContaining({
        isActive: true,
        updatedAt: new Date('2022-04-05T21:42:58.054Z'),
        createdAt: new Date('2022-04-05T21:42:58.054Z'),
        id: 'project-id-1',
        name: 'My Auth Project',
        accountId: 'my-account-id',
        env: 'live',
      }),
    );
  });

  it('should update a project', async () => {
    const client = createClient();
    const project = await client.projects.updateProject('project-id-1', {
      name: 'my-updated-project-1',
    });
    expect(project).toEqual(
      expect.objectContaining({
        isActive: true,
        updatedAt: new Date('2022-04-05T21:42:58.054Z'),
        createdAt: new Date('2022-04-05T21:42:58.054Z'),
        id: 'project-id-1',
        name: 'my-updated-project-1',
        accountId: 'my-account-id',
        env: 'live',
      }),
    );
  });
});
