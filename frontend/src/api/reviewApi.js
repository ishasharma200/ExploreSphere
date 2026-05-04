import axios from './axios';

export const getReviews = async (placeId) => {
  const res = await axios.get(`/reviews/${placeId}`);
  return res.data;
};

export const getAverageRating = async (placeId) => {
  const res = await axios.get(`/reviews/${placeId}/rating`);
  return res.data;
};

export const addReview = async (placeId, rating, comment, token) => {
  const res = await axios.post(
    '/reviews',
    { placeId, rating, comment },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
