package com.example.surveyx.controllers;

import com.example.surveyx.models.Response;
import com.example.surveyx.services.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/responses")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @GetMapping("/survey/{surveyId}")
    public ResponseEntity<List<Response>> getAllResponsesForSurvey(@PathVariable Long surveyId) {
        List<Response> responses = responseService.getAllResponsesBySurvey(surveyId);
        if (responses == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/{responseId}")
    public ResponseEntity<Response> getResponseById(@PathVariable Long responseId) {
        Response response = responseService.getResponseById(responseId);
        if (response == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/survey/{surveyId}/respondent/{respondentId}")
    public ResponseEntity<List<Response>> getResponseByRespondent(
            @PathVariable Long surveyId,
            @PathVariable String respondentId) {
        List<Response> responses = responseService.getResponsesByRespondent(
                surveyId, UUID.fromString(respondentId));
        if (responses == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Response> saveResponse(@RequestBody Response response) {
        Response savedResponse = responseService.saveResponse(response);
        return new ResponseEntity<>(savedResponse, HttpStatus.CREATED);
    }

    @PostMapping("/survey/{surveyId}")
    public ResponseEntity<List<Response>> saveResponsesForSurvey(
            @PathVariable Long surveyId,
            @RequestBody List<Response> responses
    ) {
        // Process and save all responses for the survey
        List<Response> savedResponses = responseService.saveResponsesForSurvey(surveyId, responses);
        return new ResponseEntity<>(savedResponses, HttpStatus.CREATED);
    }

    @DeleteMapping("/{responseId}")
    public ResponseEntity<Void> deleteResponse(@PathVariable Long responseId) {
        Response existingResponse = responseService.getResponseById(responseId);
        if (existingResponse == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        responseService.deleteResponse(responseId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
