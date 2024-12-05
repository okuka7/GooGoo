// src/main/java/com/server/repository/SurveyRepository.java

package com.server.survey.repository;

import com.server.survey.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
}
