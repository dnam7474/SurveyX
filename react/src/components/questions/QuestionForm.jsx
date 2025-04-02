import React, { useState, useEffect } from 'react';
import { createQuestion, updateQuestion } from '../../services/questionService';
import '../../styles/surveys.css';

const QuestionForm = ({ surveyId, question, onSave, onCancel }) => {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('text');
  const [answerOptions, setAnswerOptions] = useState(['']);
  const [required, setRequired] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (question) {
      setQuestionText(question.questionText || '');
      setQuestionType(question.questionType || 'text');
      setAnswerOptions(question.answerOptions?.length ? question.answerOptions : ['']);
      setRequired(question.required !== undefined ? question.required : true);
    }
  }, [question]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...answerOptions];
    newOptions[index] = value;
    setAnswerOptions(newOptions);
  };

  const addOption = () => {
    setAnswerOptions([...answerOptions, '']);
  };

  const removeOption = (index) => {
    const newOptions = answerOptions.filter((_, i) => i !== index);
    setAnswerOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!questionText.trim()) {
      setError('Question text is required');
      return;
    }
    
    if ((questionType === 'multiple_choice' || questionType === 'dropdown') && 
        (!answerOptions.length || !answerOptions.some(opt => opt.trim()))) {
      setError('At least one valid answer option is required');
      return;
    }
    
    try {
      setLoading(true);
      
      const questionData = {
        questionText,
        questionType,
        required,
        survey: { surveyId },
      };
      
      if (questionType === 'multiple_choice' || questionType === 'dropdown') {
        questionData.answerOptions = answerOptions.filter(opt => opt.trim());
      }
      
      let result;
      if (question?.questionId) {
        questionData.questionId = question.questionId;
        result = await updateQuestion(question.questionId, questionData);
      } else {
        result = await createQuestion(questionData);
      }
      
      onSave(result.data);
      
    } catch (err) {
      setError('Failed to save question: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-form">
      <h3>{question ? 'Edit Question' : 'Add Question'}</h3>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="questionText">Question Text</label>
          <textarea
            id="questionText"
            className="form-control"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="questionType">Question Type</label>
          <select
            id="questionType"
            className="form-control"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="rating">Rating</option>
            <option value="dropdown">Dropdown</option>
          </select>
        </div>
        
        {(questionType === 'multiple_choice' || questionType === 'dropdown') && (
          <div className="form-group">
            <label>Answer Options</label>
            {answerOptions.map((option, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder="Option text"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeOption(index)}
                    disabled={answerOptions.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={addOption}
            >
              Add Option
            </button>
          </div>
        )}
        
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="required"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="required">
            Required
          </label>
        </div>
        
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary mr-2"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;