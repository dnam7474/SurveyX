import React, { useState } from 'react';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import QuestionForm from './QuestionForm';
import { deleteQuestion } from '../../services/questionService';
import '../../styles/surveys.css';

const QuestionList = ({ surveyId, questions, onQuestionsChange }) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(questionId);
        onQuestionsChange(questions.filter(q => q.questionId !== questionId));
      } catch (err) {
        setError('Failed to delete question');
        console.error(err);
      }
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newQuestions = [...questions];
    [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
    onQuestionsChange(newQuestions);
  };

  const handleMoveDown = (index) => {
    if (index === questions.length - 1) return;
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
    onQuestionsChange(newQuestions);
  };

  const handleSaveQuestion = (savedQuestion) => {
    if (editingQuestion) {
      onQuestionsChange(
        questions.map(q => q.questionId === savedQuestion.questionId ? savedQuestion : q)
      );
      setEditingQuestion(null);
    } else {
      onQuestionsChange([...questions, savedQuestion]);
      setIsAdding(false);
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'text': return 'Text';
      case 'multiple_choice': return 'Multiple Choice';
      case 'rating': return 'Rating';
      case 'dropdown': return 'Dropdown';
      default: return type;
    }
  };

  if (isAdding) {
    return (
      <QuestionForm
        surveyId={surveyId}
        onSave={handleSaveQuestion}
        onCancel={() => setIsAdding(false)}
      />
    );
  }

  if (editingQuestion) {
    return (
      <QuestionForm
        surveyId={surveyId}
        question={editingQuestion}
        onSave={handleSaveQuestion}
        onCancel={() => setEditingQuestion(null)}
      />
    );
  }

  return (
    <div className="question-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Questions</h3>
        <button
          className="btn btn-primary"
          onClick={() => setIsAdding(true)}
        >
          Add Question
        </button>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {questions.length === 0 ? (
        <div className="alert alert-info">
          No questions yet. Click "Add Question" to get started.
        </div>
      ) : (
        <div className="list-group">
          {questions.map((question, index) => (
            <div className="list-group-item" key={question.questionId || index}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1"><strong>{index + 1}. {question.questionText}</strong></p>
                  <div className="text-muted d-flex gap-2 align-items-center">
                    <span className="badge bg-secondary">{getQuestionTypeLabel(question.questionType)}</span>
                    {question.required && <span className="badge bg-info">Required</span>}
                  </div>
                  
                  {question.answerOptions && question.answerOptions.length > 0 && (
                    <div className="mt-2 ms-3">
                      <small className="text-muted">Options:</small>
                      <ul className="options-list mb-0">
                        {question.answerOptions.map((option, optIndex) => (
                          <li key={optIndex}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setEditingQuestion(question)}
                    title="Edit question"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(question.questionId)}
                    title="Delete question"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === questions.length - 1}
                    title="Move down"
                  >
                    <FaArrowDown />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;