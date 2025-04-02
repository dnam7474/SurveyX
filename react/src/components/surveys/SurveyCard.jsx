import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaShareAlt, FaChartBar } from 'react-icons/fa';

const SurveyCard = ({ survey, onDelete, onPublish }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'draft':
        return <span className="badge bg-secondary">Draft</span>;
      case 'active':
        return <span className="badge bg-success">Active</span>;
      case 'closed':
        return <span className="badge bg-danger">Closed</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="card h-100 survey-card">
      <div className="card-body">
        <h5 className="card-title">{survey.title}</h5>
        <div className="d-flex justify-content-between mb-2">
          {getStatusBadge(survey.status)}
          <small className="text-muted">Responses: {survey.responseCount || 0}</small>
        </div>
        <p className="card-text">{survey.description || 'No description'}</p>
        
        <div className="card-info mt-3">
          <div><strong>Created:</strong> {formatDate(survey.createdAt)}</div>
          {survey.expiresAt && (
            <div><strong>Expires:</strong> {formatDate(survey.expiresAt)}</div>
          )}
        </div>
      </div>
      
      <div className="card-footer bg-transparent">
        <div className="d-flex justify-content-between">
          <Link to={`/surveys/${survey.surveyId}`} className="btn btn-sm btn-outline-primary">
            <FaEdit /> Edit
          </Link>
          
          {survey.status === 'draft' ? (
            <button 
              className="btn btn-sm btn-success" 
              onClick={onPublish}
            >
              Publish
            </button>
          ) : (
            <button 
              className="btn btn-sm btn-outline-info" 
              onClick={() => navigator.clipboard.writeText(survey.clickableLink)}
              title="Copy survey link"
            >
              <FaShareAlt /> Share
            </button>
          )}
          
          <Link to={`/surveys/${survey.surveyId}/analytics`} className="btn btn-sm btn-outline-secondary">
            <FaChartBar /> Results
          </Link>
          
          <button 
            className="btn btn-sm btn-outline-danger" 
            onClick={onDelete}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;