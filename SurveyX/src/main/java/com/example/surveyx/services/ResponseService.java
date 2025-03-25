package com.example.surveyx.services;

import com.example.surveyx.models.Question;
import com.example.surveyx.models.Response;
import com.example.surveyx.models.Survey;
import com.example.surveyx.repositories.ResponseRepository;
import com.example.surveyx.repositories.SurveyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ResponseService {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private QuestionService questionService;

    public Response getResponseById(Long responseId) {
        return responseRepository.findById(responseId).orElse(null);
    }

    public List<Response> getAllResponsesBySurvey(Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId).orElse(null);
        if (survey == null) return null;
        return responseRepository.findBySurvey(survey);
    }

    public List<Response> getResponsesByRespondent(Long surveyId, UUID respondentId) {
        Survey survey = surveyRepository.findById(surveyId).orElse(null);
        if (survey == null) return null;
        return responseRepository.findBySurveyAndRespondentId(survey, respondentId);
    }


    @Transactional
    public Response saveResponse(Response response) {
        if (response.getSurvey() != null && response.getSurvey().getSurveyId() != null) {
            Survey surveyRef = new Survey();
            surveyRef.setSurveyId(response.getSurvey().getSurveyId());
            response.setSurvey(surveyRef);
        }

        if (response.getQuestion() != null && response.getQuestion().getQuestionId() != null) {
            Question questionRef = new Question();
            questionRef.setQuestionId(response.getQuestion().getQuestionId());
            response.setQuestion(questionRef);
        }

        if (response.getSubmittedAt() == null) {
            response.setSubmittedAt(LocalDateTime.now());
        }

        return responseRepository.save(response);
    }

    public void deleteResponse(Long responseId) {
        responseRepository.deleteById(responseId);
    }
}

