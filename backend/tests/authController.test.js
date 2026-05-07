const test = require('node:test');
const assert = require('node:assert/strict');
const proxyquire = require('proxyquire');

const makeResponse = () => {
  const res = {};
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (payload) {
    this.payload = payload;
    return this;
  };
  return res;
};

test('signup returns 201 and a token on successful registration', async () => {
  const { signup } = proxyquire('../controllers/authController', {
    '../models/User': {
      findOne: async () => null,
      create: async (userData) => ({ _id: '1', ...userData }),
    },
    'bcryptjs': {
      hash: async () => 'hashed-password',
    },
    '../utils/validation': {
      validateAuthSignup: () => ({ valid: true }),
      validateAuthLogin: () => ({ valid: true }),
    },
    '../utils/generateToken': () => 'token-123',
  });

  const req = { body: { name: 'Aman', email: 'aman@example.com', password: 'secret123' } };
  const res = makeResponse();

  await signup(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.token, 'token-123');
  assert.equal(res.payload.user.email, 'aman@example.com');
});

test('signup returns 400 when email already exists', async () => {
  const { signup } = proxyquire('../controllers/authController', {
    '../models/User': {
      findOne: async () => ({ _id: '1', email: 'aman@example.com' }),
    },
    'bcryptjs': {
      hash: async () => 'hashed-password',
    },
    '../utils/validation': {
      validateAuthSignup: () => ({ valid: true }),
      validateAuthLogin: () => ({ valid: true }),
    },
    '../utils/generateToken': () => 'token-123',
  });

  const req = { body: { name: 'Aman', email: 'aman@example.com', password: 'secret123' } };
  const res = makeResponse();

  await signup(req, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.message, 'Email already registered');
});

test('login returns 200 and a token when credentials are valid', async () => {
  const { login } = proxyquire('../controllers/authController', {
    '../models/User': {
      findOne: async () => ({
        _id: '1',
        name: 'Aman',
        email: 'aman@example.com',
        password: '$2a$10$dummyhash',
      }),
    },
    'bcryptjs': {
      compare: async () => true,
    },
    '../utils/validation': {
      validateAuthSignup: () => ({ valid: true }),
      validateAuthLogin: () => ({ valid: true }),
    },
    '../utils/generateToken': () => 'token-abc',
  });

  const req = { body: { email: 'aman@example.com', password: 'secret123' } };
  const res = makeResponse();

  await login(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.token, 'token-abc');
  assert.equal(res.payload.user.email, 'aman@example.com');
});

test('login returns 401 when password is invalid', async () => {
  const { login } = proxyquire('../controllers/authController', {
    '../models/User': {
      findOne: async () => ({
        _id: '1',
        name: 'Aman',
        email: 'aman@example.com',
        password: '$2a$10$dummyhash',
      }),
    },
    'bcryptjs': {
      compare: async () => false,
    },
    '../utils/validation': {
      validateAuthSignup: () => ({ valid: true }),
      validateAuthLogin: () => ({ valid: true }),
    },
    '../utils/generateToken': () => 'token-abc',
  });

  const req = { body: { email: 'aman@example.com', password: 'wrongpass' } };
  const res = makeResponse();

  await login(req, res);
  assert.equal(res.statusCode, 401);
  assert.equal(res.payload.message, 'Invalid password');
});
