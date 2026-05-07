import axios from './axios';

export const getPlaces = async () => {
  const res = await axios.get('/places');
  return res.data;
};

export const getPlaceById = async (placeId) => {
  const res = await axios.get(`/places/${placeId}`);
  return res.data;
};

export const createPlace = async (placeData, token) => {
  const res = await axios.post('/places', placeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePlace = async (placeId, placeData, token) => {
  const res = await axios.put(`/places/${placeId}`, placeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deletePlace = async (placeId, token) => {
  const res = await axios.delete(`/places/${placeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};