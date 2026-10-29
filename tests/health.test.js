const request = require('supertest');
const app = require('../src/app');
const { caso } = require('./qase/qase');

describe('GET /health', () => {
  it(caso('TC-SIS-001', 'responde con status ok'), async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});