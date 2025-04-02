import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSurveys, deleteSurvey, publishSurvey } from '../../services/surveyService';
import SurveyCard from './SurveyCard';
import '../../styles/surveys.css';

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await getAllSurveys();
      setSurveys(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load surveys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await deleteSurvey(id);
        setSurveys(surveys.filter(survey => survey.surveyId !== id));
      } catch (err) {
        setError('Failed to delete survey');
        console.error(err);
      }
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishSurvey(id);
      fetchSurveys();
    } catch (err) {
      setError('Failed to publish survey');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="survey-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Surveys</h2>
        <Link to="/surveys/create" className="btn btn-primary">
          Create New Survey
        </Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {surveys.length === 0 ? (
        <div className="alert alert-info">
          You haven't created any surveys yet. Click "Create New Survey" to get started.
        </div>
      ) : (
        <div className="row">
          {surveys.map(survey => (
            <div className="col-md-6 col-lg-4 mb-4" key={survey.surveyId}>
              <SurveyCard 
                survey={survey} 
                onDelete={() => handleDelete(survey.surveyId)} 
                onPublish={() => handlePublish(survey.surveyId)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyList;