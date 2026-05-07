export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  if (!error) {
    return fallback;
  }

  const responseMessage = error.response?.data?.message;
  if (responseMessage) {
    const details = error.response?.data?.errors;
    if (Array.isArray(details) && details.length > 0) {
      return `${responseMessage}: ${details.join(', ')}`;
    }
    return responseMessage;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};