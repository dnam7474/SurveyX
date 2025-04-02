package com.example.surveyx.repositories;


import com.example.surveyx.models.Response;
import com.example.surveyx.models.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    List<Response> findBySurvey(Survey survey);
    List<Response> findBySurveyAndRespondentId(Survey survey, UUID respondentId);
    void deleteBySurvey(Survey survey);
}
