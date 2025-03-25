package com.example.surveyx.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "response_id")
    private Long responseId;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {})  // Empty cascade to prevent updates
    @JoinColumn(name = "survey_id")
    private Survey survey;

    @Column(name = "respondent_id")
    private UUID respondentId;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {})  // Empty cascade to prevent updates
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(name = "answer_text")
    private String answerText;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
}


