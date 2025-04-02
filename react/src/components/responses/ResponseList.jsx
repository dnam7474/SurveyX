// src/components/responses/ResponseList.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getResponsesBySurvey } from '../../services/responseService';
import { getSurveyById } from '../../services/surveyService';
import { getQuestionsBySurvey } from '../../services/questionService';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/surveys.css';

const ResponseList = () => {
  const { surveyId } = useParams();
  
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupedResponses, setGroupedResponses] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load survey details
        const surveyResponse = await getSurveyById(surveyId);
        setSurvey(surveyResponse.data);
        
        // Load questions
        const questionsResponse = await getQuestionsBySurvey(surveyId);
        setQuestions(questionsResponse.data);
        
        // Load responses
        const responsesResponse = await getResponsesBySurvey(surveyId);
        setResponses(responsesResponse.data);
        
      } catch (err) {
        setError('Failed to load data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [surveyId]);
  
  useEffect(() => {
    // Group responses by respondent
    if (responses.length && questions.length) {
      const byRespondent = {};
      
      // Group by respondentId
      responses.forEach(response => {
        const respondentId = response.respondentId || 'anonymous';
        if (!byRespondent[respondentId]) {
          byRespondent[respondentId] = {
            respondentId,
            submittedAt: response.submittedAt,
            answers: {}
          };
        }
        
        // Map question ID to answer
        byRespondent[respondentId].answers[response.question.questionId] = response.answerText;
      });
      
      // Convert to array and sort by submission date
      const grouped = Object.values(byRespondent).sort((a, b) => {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      });
      
      setGroupedResponses(grouped);
    }
  }, [responses, questions]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!survey) {
    return (
      <div className="alert alert-danger">
        {error || 'Survey not found'}
      </div>
    );
  }
  
  if (responses.length === 0) {
    return (
      <div className="alert alert-info">
        No responses have been submitted for this survey yet.
      </div>
    );
  }
  
  return (
    <div className="response-list-container">
      <h2>{survey.title} - Responses</h2>
      <p>Total responses: {groupedResponses.length}</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Respondent</th>
              <th>Submitted</th>
              {questions.map(question => (
                <th key={question.questionId}>{question.questionText}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupedResponses.map((response, index) => (
              <tr key={index}>
                <td>{response.respondentId === 'anonymous' ? 'Anonymous' : response.respondentId}</td>
                <td>{new Date(response.submittedAt).toLocaleDateString()}</td>
                {questions.map(question => (
                  <td key={question.questionId}>
                    {response.answers[question.questionId] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseList;