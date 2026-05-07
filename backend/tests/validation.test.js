const test = require('node:test');
const assert = require('node:assert/strict');

const {
	validateAuthSignup,
	validateAuthLogin,
	validatePlacePayload,
	validateReviewPayload,
	isValidObjectId,
} = require('../utils/validation');

test('validateAuthSignup accepts valid signup data', () => {
	const result = validateAuthSignup({
		name: 'Aman',
		email: 'aman@example.com',
		password: 'secret123',
	});

	assert.equal(result.valid, true);
});

test('validateAuthSignup rejects weak payloads', () => {
	const result = validateAuthSignup({ name: 'A', email: 'bad-email', password: '123' });

	assert.equal(result.valid, false);
	assert.match(result.message, /Name|email|Password/);
});

test('validatePlacePayload accepts a valid place', () => {
	const result = validatePlacePayload({
		name: 'Cafe Blue',
		location: 'Downtown',
		category: 'cafe',
		description: 'A good place',
		images: ['https://example.com/image.jpg'],
	});

	assert.equal(result.valid, true);
});

test('validatePlacePayload rejects bad categories and image lists', () => {
	const result = validatePlacePayload({
		name: 'Cafe Blue',
		category: 'invalid',
		images: ['not-a-url'],
	});

	assert.equal(result.valid, false);
	assert.ok(result.errors.length >= 1);
});

test('validateReviewPayload accepts valid reviews', () => {
	const result = validateReviewPayload({
		placeId: '507f1f77bcf86cd799439011',
		rating: 5,
		comment: 'Great place',
	});

	assert.equal(result.valid, true);
});

test('validateReviewPayload rejects invalid ratings', () => {
	const result = validateReviewPayload({
		placeId: '507f1f77bcf86cd799439011',
		rating: 9,
	});

	assert.equal(result.valid, false);
	assert.match(result.message, /Rating/);
});

test('isValidObjectId checks Mongo ids', () => {
	assert.equal(isValidObjectId('507f1f77bcf86cd799439011'), true);
	assert.equal(isValidObjectId('not-an-id'), false);
});