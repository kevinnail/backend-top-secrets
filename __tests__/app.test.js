const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const { request } = require('express');
// const request = require('supertest');
// const app = require('../lib/app');

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

  it('POST api/v1/users creates a new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(fakeUser);
    expect(resp.status).toBe(200);
  });

  afterAll(() => {
    pool.end();
  });
});
