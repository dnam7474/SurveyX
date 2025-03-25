package com.example.surveyx.repositories;

import com.example.surveyx.models.Survey;
import com.example.surveyx.models.SurveyAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyAnalyticsRepository extends JpaRepository<SurveyAnalytics, Long> {
    SurveyAnalytics findBySurvey(Survey survey);
}
