package com.example.surveyx.controllers;

import com.example.surveyx.models.Question;
import com.example.surveyx.models.Survey;
import com.example.surveyx.services.QuestionService;
import com.example.surveyx.services.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private SurveyService surveyService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long questionId) {
        Question question = questionService.getQuestionById(questionId);
        if (question == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(question, HttpStatus.OK);
    }

    @GetMapping("survey/{surveyId}")
    public ResponseEntity<List<Question>> getAllSurveyQuestions(@PathVariable Long surveyId) {
        Survey survey = surveyService.getSurveyById(surveyId);
        if (survey == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<Question> questions = questionService.getQuestionsBySurvey(survey);
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question createdQuestion = questionService.createQuestion(question);
        return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long questionId, @RequestBody Question question) {
        Question existingQuestion = questionService.getQuestionById(questionId);
        if (existingQuestion == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        question.setQuestionId(questionId);
        Question updatedQuestion = questionService.updateQuestion(question);
        return new ResponseEntity<>(updatedQuestion, HttpStatus.OK);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        Question existingQuestion = questionService.getQuestionById(questionId);
        if (existingQuestion == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        questionService.deleteQuestion(questionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
