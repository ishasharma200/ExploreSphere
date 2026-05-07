const mongoose = require('mongoose');

const allowedPlaceCategories = new Set(['restaurant', 'cafe', 'hotel', 'tourist', 'shopping', 'other']);

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const isValidEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidObjectId = (value) => typeof value === 'string' && mongoose.Types.ObjectId.isValid(value);

const validateStringLength = (value, fieldName, { required = false, min = 0, max = Infinity } = {}) => {
	if (value === undefined || value === null || value === '') {
		return required ? `${fieldName} is required` : null;
	}

	if (typeof value !== 'string') {
		return `${fieldName} must be a string`;
	}

	const trimmed = value.trim();
	if (required && trimmed.length === 0) {
		return `${fieldName} is required`;
	}

	if (trimmed.length < min) {
		return `${fieldName} must be at least ${min} characters`;
	}

	if (trimmed.length > max) {
		return `${fieldName} must be ${max} characters or fewer`;
	}

	return null;
};

const validateUrlList = (images) => {
	if (images === undefined) {
		return null;
	}

	if (!Array.isArray(images)) {
		return 'Images must be an array';
	}

	if (images.length > 5) {
		return 'You can upload at most 5 images';
	}

	for (const image of images) {
		if (typeof image !== 'string' || image.trim().length === 0) {
			return 'Each image must be a valid URL';
		}

		try {
			new URL(image);
		} catch {
			return 'Each image must be a valid URL';
		}
	}

	return null;
};

const buildValidationResult = (errors) => ({
	valid: errors.length === 0,
	message: errors[0] || '',
	errors,
});

const validateAuthSignup = ({ name, email, password }) => {
	const errors = [];

	const nameError = validateStringLength(name, 'Name', { required: true, min: 2, max: 80 });
	if (nameError) errors.push(nameError);

	if (!isValidEmail(email)) {
		errors.push('A valid email is required');
	}

	const passwordError = validateStringLength(password, 'Password', { required: true, min: 6, max: 128 });
	if (passwordError) errors.push(passwordError);

	return buildValidationResult(errors);
};

const validateAuthLogin = ({ email, password }) => {
	const errors = [];

	if (!isValidEmail(email)) {
		errors.push('A valid email is required');
	}

	const passwordError = validateStringLength(password, 'Password', { required: true, min: 1, max: 128 });
	if (passwordError) errors.push(passwordError);

	return buildValidationResult(errors);
};

const validatePlacePayload = (payload, { partial = false } = {}) => {
	const errors = [];

	const nameError = validateStringLength(payload.name, 'Place name', { required: !partial, min: 2, max: 100 });
	if (nameError) errors.push(nameError);

	if (payload.location !== undefined) {
		const locationError = validateStringLength(payload.location, 'Location', { min: 0, max: 120 });
		if (locationError) errors.push(locationError);
	}

	if (payload.category !== undefined) {
		if (typeof payload.category !== 'string' || !allowedPlaceCategories.has(payload.category.trim())) {
			errors.push('Category must be one of restaurant, cafe, hotel, tourist, shopping, or other');
		}
	} else if (!partial) {
		errors.push('Category is required');
	}

	if (payload.description !== undefined) {
		const descriptionError = validateStringLength(payload.description, 'Description', { min: 0, max: 1000 });
		if (descriptionError) errors.push(descriptionError);
	}

	const imageError = validateUrlList(payload.images);
	if (imageError) errors.push(imageError);

	return buildValidationResult(errors);
};

const validateReviewPayload = (payload, { partial = false } = {}) => {
	const errors = [];

	if (!partial) {
		if (!isValidObjectId(payload.placeId)) {
			errors.push('A valid placeId is required');
		}
	}

	if (payload.rating !== undefined) {
		const rating = Number(payload.rating);
		if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
			errors.push('Rating must be an integer between 1 and 5');
		}
	} else if (!partial) {
		errors.push('Rating is required');
	}

	if (payload.comment !== undefined) {
		const commentError = validateStringLength(payload.comment, 'Comment', { min: 0, max: 500 });
		if (commentError) errors.push(commentError);
	}

	return buildValidationResult(errors);
};

module.exports = {
	validateAuthSignup,
	validateAuthLogin,
	validatePlacePayload,
	validateReviewPayload,
	isValidObjectId,
	isValidEmail,
};