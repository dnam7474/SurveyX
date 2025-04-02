package com.example.surveyx.services;

import com.example.surveyx.models.Survey;
import com.example.surveyx.models.User;
import com.example.surveyx.repositories.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Value("${app.base-url:http://localhost:5173}")
    private String baseUrl;

    public List<Survey> getAllSurveys() {
        return surveyRepository.findAll();
    }

    public Survey getSurveyById(Long surveyId) {
        return surveyRepository.findById(surveyId).orElse(null);
    }

    public Survey getSurveyByLink(String surveyLink) {
        return surveyRepository.findBySurveyLink(surveyLink);
    }

    public List<Survey> getSurveysByCreator(User creator) {
        return surveyRepository.findByCreator(creator);
    }

    public Survey createSurvey(Survey survey) {
        String uniqueId = UUID.randomUUID().toString();

        survey.setSurveyLink(uniqueId);

        if (survey.getCreatedAt() == null) {
            survey.setCreatedAt(LocalDateTime.now());
        }

        if (survey.getResponseCount() == null) {
            survey.setResponseCount(0);
        }

        if (survey.getStatus() == null || survey.getStatus().isEmpty()) {
            survey.setStatus("draft");
        }

        Survey savedSurvey = surveyRepository.save(survey);

        savedSurvey.setClickableLink(generateClickableLink(uniqueId));

        return savedSurvey;
    }

    public Survey updateSurvey(Survey survey) {
        if (survey.getSurveyId() != null) {
            Survey existingSurvey = surveyRepository.findById(survey.getSurveyId()).orElse(null);
            if (existingSurvey != null && existingSurvey.getSurveyLink() != null) {
                survey.setSurveyLink(existingSurvey.getSurveyLink());
            }
        }

        survey.setUpdatedAt(LocalDateTime.now());

        Survey savedSurvey = surveyRepository.save(survey);

        if (savedSurvey.getSurveyLink() != null) {
            savedSurvey.setClickableLink(generateClickableLink(savedSurvey.getSurveyLink()));
        }

        return savedSurvey;
    }

    public void deleteSurvey(Long surveyId) {
        surveyRepository.deleteById(surveyId);
    }

    private String generateClickableLink(String uniqueId) {
        return baseUrl + "/survey/" + uniqueId;
    }

    public Survey publishSurvey(Long surveyId) {
        Survey survey = getSurveyById(surveyId);
        if (survey != null) {
            survey.setStatus("active");
            return updateSurvey(survey);
        }
        return null;
    }

    public Survey closeSurvey(Long surveyId) {
        Survey survey = getSurveyById(surveyId);
        if (survey != null) {
            survey.setStatus("closed");
            return updateSurvey(survey);
        }
        return null;
    }

}