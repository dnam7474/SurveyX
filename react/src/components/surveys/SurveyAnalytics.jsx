import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSurveyAnalytics } from '../../services/analyticsService';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/surveys.css';

const SurveyAnalytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getSurveyAnalytics(id);
        console.log('Full analytics response:', response.data);
        setAnalytics(response.data);
      } catch (err) {
        const errorMessage = 
          err.response?.data?.message || 
          err.response?.statusText || 
          'Failed to load analytics';
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
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

  return (
    <div className="survey-analytics-container">
      <h2>Survey Analytics</h2>
      
      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title">Analysis Summary</h3>
          <p>{analytics.analysisSummary}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Insights</h3>
          <div>
            <strong>Question:</strong> {parsedInsights.question || 'N/A'}
            <br />
            <strong>Total Responses:</strong> {parsedInsights.response_count || 0}
            <br />
            <strong>Responses:</strong>
            <ul>
              {Array.isArray(parsedInsights.responses) 
                ? parsedInsights.responses.map((response, index) => (
                    <li key={index}>{response}</li>
                  ))
                : <li>No responses available</li>
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyAnalytics;