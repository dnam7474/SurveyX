import axios from '../utils/axiosConfig';

export const getAllSurveys = () => {
  return axios.get('/api/surveys');
};

export const getSurveyById = (id) => {
  return axios.get(`/api/surveys/${id}`);
};

export const createSurvey = (survey) => {
  return axios.post('/api/surveys', survey);
};

export const updateSurvey = (id, survey) => {
  return axios.put(`/api/surveys/${id}`, survey);
};

export const deleteSurvey = (id) => {
  return axios.delete(`/api/surveys/${id}`);
};

export const publishSurvey = (id) => {
  return axios.put(`/api/surveys/${id}/publish`);
};

export const getSurveyByLink = (link) => {
  return axios.get(`/survey/api/${link}`);
};