package com.example.surveyx.controllers;

import com.example.surveyx.models.SurveyAnalytics;
import com.example.surveyx.services.SurveyAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class SurveyAnalyticsController {

    @Autowired
    private SurveyAnalyticsService surveyAnalyticsService;

    @GetMapping("/survey/{surveyId}")
    public ResponseEntity<SurveyAnalytics> getAnalyticsForSurvey(@PathVariable Long surveyId) {
        SurveyAnalytics analytics = surveyAnalyticsService.getAnalyticsForSurvey(surveyId);
        if (analytics == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(analytics, HttpStatus.OK);
    }

    @PostMapping("/survey/{surveyId}")
    public ResponseEntity<SurveyAnalytics> generateAnalytics(@PathVariable Long surveyId) {
        SurveyAnalytics analytics = surveyAnalyticsService.generateAnalytics(surveyId);
        if (analytics == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(analytics, HttpStatus.CREATED);
    }

    @DeleteMapping("/{analyticsId}")
    public ResponseEntity<Void> deleteAnalytics(@PathVariable Long analyticsId) {
        surveyAnalyticsService.deleteAnalytics(analyticsId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

