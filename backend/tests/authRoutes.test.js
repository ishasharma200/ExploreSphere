const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const supertest = require('supertest');
const proxyquire = require('proxyquire');

const makeApp = () => {
  const router = proxyquire('../routes/authRoutes', {
    '../controllers/authController': {
      signup: (req, res) => res.status(201).json({ route: 'signup' }),
      login: (req, res) => res.status(200).json({ route: 'login' }),
    },
  });

  const app = express();
  app.use(express.json());
  app.use('/api/auth', router);
  return app;
};

test('authRoutes POST /signup returns 201', async () => {
  const app = makeApp();
  await supertest(app)
    .post('/api/auth/signup')
    .send({})
    .expect(201)
    .then((res) => assert.equal(res.body.route, 'signup'));
});

test('authRoutes POST /login returns 200', async () => {
  const app = makeApp();
  await supertest(app)
    .post('/api/auth/login')
    .send({})
    .expect(200)
    .then((res) => assert.equal(res.body.route, 'login'));
});
