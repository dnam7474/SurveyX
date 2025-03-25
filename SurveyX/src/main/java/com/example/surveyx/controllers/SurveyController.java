package com.example.surveyx.controllers;

import com.example.surveyx.models.Survey;
import com.example.surveyx.models.User;
import com.example.surveyx.services.SurveyService;
import com.example.surveyx.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/surveys")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Survey>> getAllSurveys() {
        List<Survey> surveys = surveyService.getAllSurveys();
        return new ResponseEntity<>(surveys, HttpStatus.OK);
    }

    @GetMapping("/{surveyId}")
    public ResponseEntity<Survey> getSurveyById(@PathVariable Long surveyId) {
        Survey survey = surveyService.getSurveyById(surveyId);
        if (survey == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(survey, HttpStatus.OK);
    }

    @GetMapping("/link/{surveyLink}")
    public ResponseEntity<Survey> getSurveyByLink(@PathVariable String surveyLink) {
        Survey survey = surveyService.getSurveyByLink(surveyLink);
        if (survey == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(survey, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Survey>> getSurveysByUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<Survey> surveys = surveyService.getSurveysByCreator(user);
        return new ResponseEntity<>(surveys, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Survey> createSurvey(@RequestBody Survey survey) {
        Survey createdSurvey = surveyService.createSurvey(survey);
        return new ResponseEntity<>(createdSurvey, HttpStatus.CREATED);
    }

    @PutMapping("/{surveyId}")
    public ResponseEntity<Survey> updateSurvey(@PathVariable Long surveyId, @RequestBody Survey survey) {
        Survey existingSurvey = surveyService.getSurveyById(surveyId);
        if (existingSurvey == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        survey.setSurveyId(surveyId);
        Survey updatedSurvey = surveyService.updateSurvey(survey);
        return new ResponseEntity<>(updatedSurvey, HttpStatus.OK);
    }

    @DeleteMapping("/{surveyId}")
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long surveyId) {
        Survey existingSurvey = surveyService.getSurveyById(surveyId);
        if (existingSurvey == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        surveyService.deleteSurvey(surveyId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{surveyId}/publish")
    public ResponseEntity<Survey> publishSurvey(@PathVariable Long surveyId) {
        Survey publishedSurvey = surveyService.publishSurvey(surveyId);
        if (publishedSurvey == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(publishedSurvey, HttpStatus.OK);
    }

    @PutMapping("/{surveyId}/close")
    public ResponseEntity<Survey> closeSurvey(@PathVariable Long surveyId) {
        Survey closedSurvey = surveyService.closeSurvey(surveyId);
        if (closedSurvey == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(closedSurvey, HttpStatus.OK);
    }

    @GetMapping("/{surveyId}/link")
    public ResponseEntity<Map<String, String>> getSurveyLink(@PathVariable Long surveyId) {
        Survey survey = surveyService.getSurveyById(surveyId);
        if (survey == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Map<String, String> response = new HashMap<>();
        response.put("surveyLink", survey.getSurveyLink());
        response.put("clickableLink", survey.getClickableLink());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
