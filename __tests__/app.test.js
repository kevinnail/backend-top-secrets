const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const fakeUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'super@defense.gov',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? fakeUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...fakeUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST api/v1/users creates a new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(fakeUser);
    expect(resp.status).toBe(200);
    const { firstName, lastName, email } = fakeUser;
    expect(resp.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('POST /api/v1/users/sessions signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(fakeUser);
    const resp = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'super@defense.gov', password: '12345' });
    expect(resp.status).toBe(200);
  });

  it('GET api/v1/secrets should return a list of secrets if signed in', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.get('/api/v1/secrets');

    expect(resp.status).toBe(200);
    expect(resp.body[0]).toEqual({
      created_at: expect.any(String),
      description:
        'You just have think the right thoughts and you will be super and hooray. ',
      id: '1',
      title: 'Superior health',
    });
  });

  it('POST api/v1/secrets should create a new secret', async () => {
    const secret = {
      title: 'Secret to success',
      description: 'Join the Church of the Latter Day Dude',
    };
    const [agent] = await registerAndLogin();
    const resp = await agent.post('/api/v1/secrets').send(secret);
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      title: 'Secret to success',
      description: 'Join the Church of the Latter Day Dude',
      created_at: expect.any(String),
    });
  });

  it('DELETE /api/v1/users/sessions deletes the user session', async () => {
    const agent = request.agent(app);
    const user = await UserService.create({ ...fakeUser });

    await agent.post('/api/v1/users/sessions').send(user);
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });

  afterAll(() => {
    pool.end();
  });
});
