package com.example.surveyx.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "surveys")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "survey_id")
    private Long surveyId;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private com.example.surveyx.models.User creator;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "survey_link", unique = true)
    private String surveyLink;

    @Column(name = "status")
    private String status = "draft";

    @Column(name = "response_count")
    private Integer responseCount = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Transient
    private String clickableLink;
}
