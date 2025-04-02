import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSurveyAnalytics } from '../../services/analyticsService';
import { getResponsesBySurvey } from '../../services/responseService';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/surveys.css';

const SurveyAnalytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsResponse = await getSurveyAnalytics(id);
        setAnalytics(analyticsResponse.data);

        const responsesResponse = await getResponsesBySurvey(id);
        setResponses(responsesResponse.data);
      } catch (err) {
        const errorMessage = 
          err.response?.data?.message || 
          err.response?.statusText || 
          'Failed to load data';
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const parsedInsights = (() => {
    try {
      return analytics.insights ? JSON.parse(analytics.insights) : {};
    } catch (err) {
      console.error('Error parsing insights:', err);
      return {};
    }
  })();


  const groupedResponses = responses.reduce((acc, response) => {
    const respondentId = response.respondentId || 'Anonymous';
    if (!acc[respondentId]) {
      acc[respondentId] = [];
    }
    acc[respondentId].push(response);
    return acc;
  }, {});

  return (
    <div className="survey-analytics-container">
      <h2>Survey Analytics</h2>
      
      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title">AI Analysis</h3>
          <p>{analytics.analysisSummary}</p>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title">All Responses</h3>
          {Object.entries(groupedResponses).map(([respondentId, respondentResponses, index]) => (
            <div key={respondentId} className="mb-4">
              <h4>Respondent: </h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  {respondentResponses.map((response, index) => (
                    <tr key={index}>
                      <td>{response.question.questionText}</td>
                      <td>{response.answerText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyAnalytics;