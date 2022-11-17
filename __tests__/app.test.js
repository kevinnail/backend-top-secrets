const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const fakeUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'super@email.com',
    password: '12345',
  };

  it.skip('POST api/v1/users creates a new user', async () => {
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
      .send({ email: 'super@email.com', password: '12345' });
    expect(resp.status).toBe(200);
  });

  afterAll(() => {
    pool.end();
  });
});
