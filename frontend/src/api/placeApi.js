import axios from './axios';

export const getPlaces = async () => {
  const res = await axios.get('/places');
  return res.data;
};

export const getPlaceById = async (placeId) => {
  const res = await axios.get(`/places/${placeId}`);
  return res.data;
};