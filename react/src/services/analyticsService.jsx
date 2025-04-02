import axios from '../utils/axiosConfig';

export const getSurveyAnalytics = (surveyId) => {
  return axios.get(`/api/analytics/survey/${surveyId}`);
};

export const generateSurveyAnalytics = (surveyId) => {
  return axios.post(`/api/analytics/survey/${surveyId}`);
};