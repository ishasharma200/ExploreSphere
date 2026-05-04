import axios from './axios';

export const signup = async (name, email, password) => {
  const res = await axios.post('/auth/signup', { name, email, password });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post('/auth/login', { email, password });
  return res.data;
};
