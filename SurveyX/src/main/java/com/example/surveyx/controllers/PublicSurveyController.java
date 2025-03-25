package com.example.surveyx.controllers;

import com.example.surveyx.models.Question;
import com.example.surveyx.models.Response;
import com.example.surveyx.models.Survey;
import com.example.surveyx.services.QuestionService;
import com.example.surveyx.services.ResponseService;
import com.example.surveyx.services.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@Controller
@RequestMapping("/survey")
public class PublicSurveyController {

    @Autowired
    private SurveyService surveyService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private ResponseService responseService;


    @GetMapping("/{surveyLink}")
    public String viewSurvey(@PathVariable String surveyLink, Map<String, Object> model) {
        Survey survey = surveyService.getSurveyByLink(surveyLink);

        if (survey == null || !"active".equals(survey.getStatus())) {
            // If survey doesn't exist or isn't active, show error
            model.put("error", "Survey not found or not currently active");
            return "error";
        }

        List<Question> questions = questionService.getQuestionsBySurvey(survey);

        model.put("survey", survey);
        model.put("questions", questions);

        return "survey-form";
    }


    @GetMapping("/api/{surveyLink}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getSurveyData(@PathVariable String surveyLink) {
        Survey survey = surveyService.getSurveyByLink(surveyLink);

        if (survey == null || !"active".equals(survey.getStatus())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<Question> questions = questionService.getQuestionsBySurvey(survey);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("survey", survey);
        responseData.put("questions", questions);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


    @PostMapping("/api/{surveyLink}/submit")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> submitSurveyResponse(
            @PathVariable String surveyLink,
            @RequestBody List<Response> responses) {

        Survey survey = surveyService.getSurveyByLink(surveyLink);

        if (survey == null || !"active".equals(survey.getStatus())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        UUID respondentId = UUID.randomUUID();

        for (Response response : responses) {
            response.setSurvey(survey);
            response.setRespondentId(respondentId);
            responseService.saveResponse(response);
        }

        survey.setResponseCount(survey.getResponseCount() + 1);
        surveyService.updateSurvey(survey);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Survey responses submitted successfully");
        result.put("respondentId", respondentId.toString());

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
}
