import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';

// Auth components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Survey components
import SurveyList from './components/surveys/SurveyList';
import SurveyForm from './components/surveys/SurveyForm';
import SurveyDetail from './components/surveys/SurveyDetail';
import SurveyAnalytics from './components/surveys/SurveyAnalytics';

// Question components
import QuestionList from './components/questions/QuestionList';
import QuestionForm from './components/questions/QuestionForm';

// Response components
import ResponseList from './components/responses/ResponseList';
import SubmitResponse from './components/responses/SubmitResponse';

const Layout = () => {
  const location = useLocation();
  const isPublicSurveyRoute = location.pathname.startsWith('/survey/');

  return (
    <div className="app-container">
      {!isPublicSurveyRoute && <Header />}
      <main className="container py-4">
        <Outlet />
      </main>
      {!isPublicSurveyRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/survey/:surveyLink" element={<SubmitResponse />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <SurveyList />
            </PrivateRoute>
          } />
          
          {/* Survey routes */}
          <Route path="/surveys/create" element={
            <PrivateRoute>
              <SurveyForm />
            </PrivateRoute>
          } />
          <Route path="/surveys/:id" element={
            <PrivateRoute>
              <SurveyDetail />
            </PrivateRoute>
          } />
          <Route path="/surveys/:id/edit" element={
            <PrivateRoute>
              <SurveyForm />
            </PrivateRoute>
          } />
          
          {/* Response routes */}
          <Route path="/surveys/:surveyId/responses" element={
            <PrivateRoute>
              <ResponseList />
            </PrivateRoute>
          } />
          
          {/* Analytics route */}
          <Route path="/surveys/:id/analytics" element={
            <PrivateRoute>
              <SurveyAnalytics />
            </PrivateRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<div className="alert alert-warning">Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;