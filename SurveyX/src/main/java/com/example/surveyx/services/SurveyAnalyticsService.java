package com.example.surveyx.services;

import com.example.surveyx.models.Response;
import com.example.surveyx.models.Survey;
import com.example.surveyx.models.SurveyAnalytics;
import com.example.surveyx.repositories.ResponseRepository;
import com.example.surveyx.repositories.SurveyAnalyticsRepository;
import com.example.surveyx.repositories.SurveyRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SurveyAnalyticsService {

    @Autowired
    private SurveyAnalyticsRepository surveyAnalyticsRepository;

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    public SurveyAnalytics getAnalyticsForSurvey(Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId).orElse(null);
        if (survey == null) return null;
        return surveyAnalyticsRepository.findBySurvey(survey);
    }

    public SurveyAnalytics generateAnalytics(Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId).orElse(null);
        if (survey == null) return null;

        SurveyAnalytics analytics = surveyAnalyticsRepository.findBySurvey(survey);
        if (analytics == null) {
            analytics = new SurveyAnalytics();
            analytics.setSurvey(survey);
            analytics.setCreatedAt(LocalDateTime.now());
        }

        try {
            List<Response> responses = responseRepository.findBySurvey(survey);

            if (responses.isEmpty()) {
                analytics.setAnalysisSummary("No responses have been collected for this survey yet.");
                analytics.setInsights("{}");
                return surveyAnalyticsRepository.save(analytics);
            }

            String prompt = formatSurveyData(survey, responses);

            Map<String, String> analysisResult = callOpenAI(prompt);

            analytics.setAnalysisSummary(analysisResult.get("summary"));
            analytics.setInsights(analysisResult.get("insights"));

            return surveyAnalyticsRepository.save(analytics);

        } catch (Exception e) {
            analytics.setAnalysisSummary("Error generating analysis: " + e.getMessage());
            analytics.setInsights("{}");
            return surveyAnalyticsRepository.save(analytics);
        }
    }


    private String formatSurveyData(Survey survey, List<Response> responses) {
        StringBuilder data = new StringBuilder();
        data.append("Survey Title: ").append(survey.getTitle()).append("\n");
        data.append("Description: ").append(survey.getDescription()).append("\n\n");

        Map<Long, List<String>> responsesByQuestion = new HashMap<>();
        Map<Long, String> questionTexts = new HashMap<>();

        for (Response response : responses) {
            if (response.getQuestion() != null) {
                Long qId = response.getQuestion().getQuestionId();
                questionTexts.put(qId, response.getQuestion().getQuestionText());

                if (!responsesByQuestion.containsKey(qId)) {
                    responsesByQuestion.put(qId, new ArrayList<>());
                }
                responsesByQuestion.get(qId).add(response.getAnswerText());
            }
        }

        for (Map.Entry<Long, String> entry : questionTexts.entrySet()) {
            Long qId = entry.getKey();
            String questionText = entry.getValue();
            List<String> answers = responsesByQuestion.get(qId);

            data.append("Question: ").append(questionText).append("\n");
            data.append("Responses:\n");
            for (String answer : answers) {
                data.append("- ").append(answer).append("\n");
            }
            data.append("\n");
        }

        return data.toString();
    }

    private Map<String, String> callOpenAI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + openaiApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo"); // Use a valid model

            List<Map<String, String>> messages = new ArrayList<>();

            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content",
                    "You are a survey analyst. Analyze the survey data and provide insights. " +
                            "Return JSON with two fields: 'summary' (a brief overview) and 'insights' (detailed findings). " +
                            "Ensure the JSON is properly formatted and valid."
            );
            messages.add(systemMessage);

            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", "Analyze this survey data:\n\n" + prompt);
            messages.add(userMessage);

            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions",
                    entity,
                    Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            String content = extractContentFromResponse(responseBody);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode;

            try {
                rootNode = mapper.readTree(content);
                String summary = rootNode.get("summary").asText();
                String insights = rootNode.get("insights").toString();

                Map<String, String> result = new HashMap<>();
                result.put("summary", summary);
                result.put("insights", insights);
                return result;
            } catch (Exception e) {
                Map<String, String> fallback = new HashMap<>();
                fallback.put("summary", "Analysis completed but format was unexpected.");
                fallback.put("insights", "{}");
                return fallback;
            }

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("summary", "Error analyzing survey: " + e.getMessage());
            error.put("insights", "{}");
            return error;
        }
    }

    private String extractContentFromResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, String> message = (Map<String, String>) firstChoice.get("message");
            return message.get("content");
        } catch (Exception e) {
            return "{}";
        }
    }

    public void deleteAnalytics(Long analyticsId) {
        surveyAnalyticsRepository.deleteById(analyticsId);
    }
}