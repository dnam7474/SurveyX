import axios from '../utils/axiosConfig';

export const register = (username, email, password) => {
  return axios.post('/api/auth/signup', {
    username,
    email,
    password,
  });
};

export const login = (username, password) => {
  return axios
    .post('/api/auth/login', {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};