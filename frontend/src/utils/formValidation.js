export const isValidEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const validateSignupForm = ({ name, email, password }) => {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }

  if (!isValidEmail(email)) {
    return 'Enter a valid email address';
  }

  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  return '';
};

export const validateLoginForm = ({ email, password }) => {
  if (!isValidEmail(email)) {
    return 'Enter a valid email address';
  }

  if (!password || password.trim().length === 0) {
    return 'Password is required';
  }

  return '';
};

export const validatePlaceForm = ({ name, category, description }) => {
  if (!name || name.trim().length < 2) {
    return 'Place name must be at least 2 characters long';
  }

  if (!category) {
    return 'Please choose a category';
  }

  if (description && description.length > 1000) {
    return 'Description must be 1000 characters or fewer';
  }

  return '';
};

export const validateReviewForm = ({ rating, comment }) => {
  const parsedRating = Number(rating);

  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return 'Rating must be between 1 and 5';
  }

  if (comment && comment.length > 500) {
    return 'Comment must be 500 characters or fewer';
  }

  return '';
};