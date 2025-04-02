// src/components/responses/SubmitResponse.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurveyByLink } from '../../services/surveyService';
import { submitResponses } from '../../services/responseService';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/surveys.css';

const SubmitResponse = () => {
  const { surveyLink } = useParams();
  const navigate = useNavigate();
  
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setLoading(true);
        const response = await getSurveyByLink(surveyLink);
        setSurvey(response.data.survey);
        setQuestions(response.data.questions);
        
        // Initialize answers
        const initialAnswers = {};
        response.data.questions.forEach(q => {
          initialAnswers[q.questionId] = '';
        });
        setAnswers(initialAnswers);
        
      } catch (err) {
        setError('Survey not found or not currently active.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSurvey();
  }, [surveyLink]);
  
  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    const unansweredRequired = questions
      .filter(q => q.required)
      .filter(q => !answers[q.questionId] || answers[q.questionId].trim() === '');
    
    if (unansweredRequired.length > 0) {
      setError(`Please answer all required questions (${unansweredRequired.length} unanswered)`);
      // src/components/responses/SubmitResponse.js (continued)
      return;
    }
    
    try {
      setSubmitting(true);
      
      const responsesData = Object.keys(answers).map(questionId => ({
        question: { questionId: parseInt(questionId) },
        survey: { surveyId: survey.surveyId },
        answerText: answers[questionId]
      }));
      
      await submitResponses(surveyLink, responsesData);
      setSuccess(true);
      
    } catch (err) {
      setError('Failed to submit responses: ' + (err.response?.data?.message || err.message));
      setSubmitting(false);
    }
  };
  
  const renderQuestionInput = (question) => {
    switch (question.questionType) {
      case 'text':
        return (
          <textarea
            className="form-control"
            value={answers[question.questionId] || ''}
            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
            rows="3"
            required={question.required}
          />
        );
        
      case 'multiple_choice':
        return (
          <div className="option-group">
            {question.answerOptions.map((option, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  id={`q${question.questionId}_opt${index}`}
                  name={`question_${question.questionId}`}
                  value={option}
                  checked={answers[question.questionId] === option}
                  onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                  required={question.required}
                />
                <label className="form-check-label" htmlFor={`q${question.questionId}_opt${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'rating':
        return (
          <div className="rating-group">
            {[1, 2, 3, 4, 5].map(rating => (
              <div className="form-check form-check-inline" key={rating}>
                <input
                  className="form-check-input"
                  type="radio"
                  id={`q${question.questionId}_rating${rating}`}
                  name={`question_${question.questionId}`}
                  value={rating}
                  checked={answers[question.questionId] === rating.toString()}
                  onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                  required={question.required}
                />
                <label className="form-check-label" htmlFor={`q${question.questionId}_rating${rating}`}>
                  {rating}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'dropdown':
        return (
          <select
            className="form-control"
            value={answers[question.questionId] || ''}
            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.answerOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
        
      default:
        return (
          <input
            type="text"
            className="form-control"
            value={answers[question.questionId] || ''}
            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
            required={question.required}
          />
        );
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error && !survey) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="submit-success">
        <div className="card">
          <div className="card-body text-center">
            <h2>Thank You!</h2>
            <p className="lead">Your response has been successfully submitted.</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="submit-response-container">
      <div className="card">
        <div className="card-header">
          <h2>{survey?.title}</h2>
          {survey?.description && <p className="lead">{survey.description}</p>}
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <div className="question-item mb-4" key={question.questionId}>
                <label className={`form-label question-label ${question.required ? 'required' : ''}`}>
                  <span className="question-number">{index + 1}.</span> {question.questionText}
                </label>
                {renderQuestionInput(question)}
              </div>
            ))}
            
            <div className="d-grid gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitResponse;