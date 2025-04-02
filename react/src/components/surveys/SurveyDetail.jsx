// src/components/surveys/SurveyDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSurveyById, publishSurvey } from '../../services/surveyService';
import { getQuestionsBySurvey } from '../../services/questionService';
import LoadingSpinner from '../common/LoadingSpinner';
import QuestionList from '../questions/QuestionList';
import { FaClipboard, FaChartBar } from 'react-icons/fa';
import '../../styles/surveys.css';

const SurveyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  useEffect(() => {
    const loadSurveyDetails = async () => {
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
    
    loadSurveyDetails();
  }, [id]);
  
  const handleQuestionsUpdate = (updatedQuestions) => {
    setQuestions(updatedQuestions);
  };
  
  const handlePublish = async () => {
    if (questions.length === 0) {
      setError('You need to add at least one question before publishing');
      return;
    }
    
    if (window.confirm('Are you sure you want to publish this survey? It will be available to respondents.')) {
      try {
        const response = await publishSurvey(id);
        setSurvey(response.data);
      } catch (err) {
        setError('Failed to publish survey: ' + (err.response?.data?.message || err.message));
      }
    }
  };
  
  const copyLinkToClipboard = () => {
    if (survey?.clickableLink) {
      navigator.clipboard.writeText(survey.clickableLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!survey) {
    return (
      <div className="alert alert-danger">
        {error || 'Survey not found'}
        <div className="mt-3">
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="survey-detail-container">
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>{survey.title}</h2>
          <div>
            <Link to={`/surveys/${id}/edit`} className="btn btn-outline-primary me-2">
              Edit Survey
            </Link>
            <Link to={`/surveys/${id}/analytics`} className="btn btn-outline-secondary me-2">
              <FaChartBar /> Analytics
            </Link>
            {survey.status === 'draft' ? (
              <button
                className="btn btn-success"
                onClick={handlePublish}
                disabled={questions.length === 0}
              >
                Publish
              </button>
            ) : (
              <button
                className="btn btn-outline-info"
                onClick={copyLinkToClipboard}
                disabled={!survey.clickableLink}
              >
                <FaClipboard /> {linkCopied ? 'Copied!' : 'Copy Link'}
              </button>
            )}
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="survey-info">
            <p className="mb-1">
              <strong>Status:</strong> 
              <span className={`badge ${survey.status === 'active' ? 'bg-success' : 'bg-secondary'} ms-2`}>
                {survey.status}
              </span>
            </p>
            <p className="mb-1"><strong>Description:</strong> {survey.description || 'No description'}</p>
            <p className="mb-1"><strong>Created:</strong> {formatDate(survey.createdAt)}</p>
            {survey.expiresAt && (
              <p className="mb-1"><strong>Expires:</strong> {formatDate(survey.expiresAt)}</p>
            )}
            <p className="mb-3"><strong>Responses:</strong> {survey.responseCount || 0}</p>
            
            {survey.status === 'active' && survey.clickableLink && (
              <div className="alert alert-info">
                <strong>Survey Link:</strong> 
                <span className="ms-2">{survey.clickableLink}</span>
                <button
                  className="btn btn-sm btn-outline-primary ms-2"
                  onClick={copyLinkToClipboard}
                >
                  {linkCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          <QuestionList
            surveyId={parseInt(id)}
            questions={questions}
            onQuestionsChange={handleQuestionsUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default SurveyDetail;