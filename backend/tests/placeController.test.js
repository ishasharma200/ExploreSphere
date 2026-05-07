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

test('getPlaces returns place list', async () => {
  const { getPlaces } = proxyquire('../controllers/placeController', {
    '../models/Place': {
      find: () => ({ populate: async () => [{ name: 'Cafe Blue' }] }),
    },
    '../models/Review': {},
    '../utils/validation': {
      validatePlacePayload: () => ({ valid: true }),
      isValidObjectId: () => true,
    },
  });

  const req = {};
  const res = makeResponse();

  await getPlaces(req, res);
  assert.deepEqual(res.payload, [{ name: 'Cafe Blue' }]);
});

test('createPlace returns 201 and emits event when successful', async () => {
  let emitted = null;
  const { createPlace } = proxyquire('../controllers/placeController', {
    '../models/Place': {
      create: async (payload) => ({
        ...payload,
        populate: async function () {
          return { ...this, createdBy: { name: 'Aman', email: 'aman@example.com' } };
        },
      }),
    },
    '../models/Review': {},
    '../utils/validation': {
      validatePlacePayload: () => ({ valid: true }),
      isValidObjectId: () => true,
    },
  });

  const req = {
    body: {
      name: 'Cafe Blue',
      location: 'Downtown',
      category: 'cafe',
      description: 'A nice venue',
      images: ['https://example.com/image.jpg'],
    },
    userId: '1',
    app: {
      get: () => ({ emit: (event, value) => { emitted = { event, value }; } }),
    },
  };
  const res = makeResponse();

  await createPlace(req, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.name, 'Cafe Blue');
  assert.equal(emitted.event, 'place:created');
});

test('createPlace returns 400 when payload invalid', async () => {
  const { createPlace } = proxyquire('../controllers/placeController', {
    '../models/Place': {
      create: async () => ({})
    },
    '../models/Review': {},
    '../utils/validation': {
      validatePlacePayload: () => ({ valid: false, message: 'Invalid payload', errors: ['name'] }),
      isValidObjectId: () => true,
    },
  });

  const req = { body: {} };
  const res = makeResponse();

  await createPlace(req, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.message, 'Invalid payload');
});
