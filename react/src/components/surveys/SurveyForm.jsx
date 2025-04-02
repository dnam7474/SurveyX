// src/components/surveys/SurveyForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSurvey, getSurveyById, updateSurvey } from '../../services/surveyService';
import { getQuestionsBySurvey } from '../../services/questionService';
import QuestionList from '../questions/QuestionList';
import LoadingSpinner from '../common/LoadingSpinner';
import { getCurrentUser } from '../../services/authService';
import '../../styles/surveys.css';

const SurveyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    expiresAt: '',
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadSurvey = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const surveyResponse = await getSurveyById(id);
        setSurvey(surveyResponse.data);
        
        const questionsResponse = await getQuestionsBySurvey(id);
        setQuestions(questionsResponse.data);
        
      } catch (err) {
        setError('Failed to load survey: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    loadSurvey();
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurvey({ ...survey, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!survey.title.trim()) {
      setError('Survey title is required');
      return;
    }
    
    try {
      setSaving(true);
      
      const surveyData = {
        ...survey,
        creator: { userId: currentUser.id }
      };
      
      let savedSurvey;
      if (id) {
        savedSurvey = await updateSurvey(id, surveyData);
      } else {
        savedSurvey = await createSurvey(surveyData);
      }
      
      navigate(`/surveys/${savedSurvey.data.surveyId}`);
      
    } catch (err) {
      setError('Failed to save survey: ' + (err.response?.data?.message || err.message));
      setSaving(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="survey-form-container">
      <div className="card mb-4">
        <div className="card-header">
          <h2>{id ? 'Edit Survey' : 'Create New Survey'}</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="title">Survey Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={survey.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group mb-3">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                value={survey.description || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group mb-3">
              <label htmlFor="expiresAt">Expiration Date (Optional)</label>
              <input
                type="datetime-local"
                className="form-control"
                id="expiresAt"
                name="expiresAt"
                value={survey.expiresAt || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : (id ? 'Update Survey' : 'Create Survey')}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={() => navigate('/dashboard')}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {id && (
        <div className="card">
          <div className="card-body">
            <QuestionList
              surveyId={parseInt(id)}
              questions={questions}
              onQuestionsChange={setQuestions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyForm;