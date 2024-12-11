// src/main/java/com/server/repository/SurveyRepository.java

package com.server.repository;

import com.server.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
}
