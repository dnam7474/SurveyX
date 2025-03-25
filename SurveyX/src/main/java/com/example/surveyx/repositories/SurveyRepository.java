package com.example.surveyx.repositories;

import com.example.surveyx.models.Survey;
import com.example.surveyx.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByCreator(User creator);
    Survey findBySurveyLink(String surveyLink);
}
