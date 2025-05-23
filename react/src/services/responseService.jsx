import axios from '../utils/axiosConfig';

export const getQuestionsBySurvey = (surveyId) => {
  return axios.get(`/api/questions/survey/${surveyId}`);
};

export const createQuestion = (question) => {
  return axios.post('/api/questions', question);
};

export const updateQuestion = (id, question) => {
  return axios.put(`/api/questions/${id}`, question);
};

export const deleteQuestion = (id) => {
  return axios.delete(`/api/questions/${id}`);
};

export const getResponsesBySurvey = (surveyId) => {
  return axios.get(`/api/responses/survey/${surveyId}`);
};

export const submitResponses = async (surveyLink, responses) => {
  try {
    const surveyResponse = await axios.get(`/survey/api/${surveyLink}`);
    const surveyId = surveyResponse.data.survey.surveyId;
    
    return axios.post(`/api/responses/survey/${surveyId}`, responses);
  } catch (error) {
    console.error('Error submitting responses:', error);
    throw error;
  }
};