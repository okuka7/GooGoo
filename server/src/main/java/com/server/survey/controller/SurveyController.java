// src/main/java/com/server/controller/SurveyController.java

package com.server.survey.controller;

import com.server.survey.dto.SurveyDTO;
import com.server.survey.model.Survey;
import com.server.auth.model.User;
import com.server.survey.repository.SurveyRepository;
import com.server.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/survey")
public class SurveyController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SurveyRepository surveyRepository;

    @PostMapping
    public ResponseEntity<?> submitSurvey(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                          @RequestBody SurveyDTO surveyDTO) {
        // 사용자 정보 가져오기
        User user = userRepository.findByUsername(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (user.isSurveyCompleted()) {
            return ResponseEntity.badRequest().body("이미 설문을 완료했습니다.");
        }

        // DTO를 Survey 엔티티로 매핑
        Survey survey = new Survey();
        survey.setHasPet(surveyDTO.getHasPet());
        survey.setPetType(surveyDTO.getPetType());
        survey.setNumberOfPets(surveyDTO.getNumberOfPets());
        survey.setHasPetExperience(surveyDTO.getHasPetExperience());
        survey.setPetExperienceType(surveyDTO.getPetExperienceType());
        survey.setHousingType(surveyDTO.getHousingType());
        survey.setHouseholdMembers(surveyDTO.getHouseholdMembers());
        survey.setAgeGroup(surveyDTO.getAgeGroup());
        survey.setOccupation(surveyDTO.getOccupation());
        survey.setPetPurpose(surveyDTO.getPetPurpose());
        survey.setPetBudget(surveyDTO.getPetBudget());
        survey.setSpecialRequirements(surveyDTO.getSpecialRequirements());

        // 설문 저장
        Survey savedSurvey = surveyRepository.save(survey);

        // 사용자와 설문 연결
        user.setSurvey(savedSurvey);
        userRepository.save(user);

        return ResponseEntity.ok("설문이 성공적으로 제출되었습니다.");
    }

    @GetMapping("/status")
    public ResponseEntity<?> getSurveyStatus(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        User user = userRepository.findByUsername(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        boolean isCompleted = user.isSurveyCompleted();
        return ResponseEntity.ok(isCompleted);
    }
}
