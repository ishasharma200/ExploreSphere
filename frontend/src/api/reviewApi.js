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

export const updateReview = async (reviewId, reviewData, token) => {
  const res = await axios.put(`/reviews/${reviewId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteReview = async (reviewId, token) => {
  const res = await axios.delete(`/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
