// src/main/java/com/server/survey/controller/SurveyController.java

package com.server.survey.controller;

import com.server.survey.dto.SurveyDTO;
import com.server.survey.model.Survey;
import com.server.auth.model.User;
import com.server.survey.repository.SurveyRepository;
import com.server.auth.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/survey")
public class SurveyController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SurveyRepository surveyRepository;

    // 설문 제출 엔드포인트
    @PostMapping
    public ResponseEntity<?> submitSurvey(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                          @RequestBody SurveyDTO surveyDTO) {
        // 사용자 정보 가져오기
        User user = userRepository.findByUsername(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (user.isSurveyCompleted()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("이미 설문을 완료했습니다."));
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

        // 양방향 관계 설정
        survey.setUser(user); // Survey에 User 설정 (헬퍼 메서드 사용 시 자동으로 User의 survey도 설정됨)

        // 설문 저장 (CascadeType.ALL이 설정되어 있으므로 user 저장 시 survey도 함께 저장됨)
        userRepository.save(user);

        return ResponseEntity.ok(new SuccessResponse("설문이 성공적으로 제출되었습니다."));
    }


    // 설문 상태 확인 엔드포인트
    @GetMapping("/status")
    public ResponseEntity<?> getSurveyStatus(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        User user = userRepository.findByUsername(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        boolean isCompleted = user.isSurveyCompleted();
        return ResponseEntity.ok(new SurveyStatusResponse(isCompleted));
    }

    // 특정 유저의 설문 정보 가져오기 엔드포인트
    @GetMapping("/user/{user_id}")
    public ResponseEntity<?> getSurveyByUserId(@PathVariable("user_id") Long user_id) {
        System.out.println("Requested User ID: " + user_id); // 디버깅 로그 추가

        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다. ID: " + user_id));

        Survey survey = user.getSurvey();

        if (survey == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("해당 유저는 설문을 작성하지 않았습니다."));
        }

        SurveyDTO surveyDTO = new SurveyDTO(
                survey.getHasPet(),
                survey.getPetType(),
                survey.getNumberOfPets(),
                survey.getHasPetExperience(),
                survey.getPetExperienceType(),
                survey.getHousingType(),
                survey.getHouseholdMembers(),
                survey.getAgeGroup(),
                survey.getOccupation(),
                survey.getPetPurpose(),
                survey.getPetBudget(),
                survey.getSpecialRequirements()
        );

        return ResponseEntity.ok(surveyDTO);
    }

    @GetMapping
    public ResponseEntity<?> getAllSurveys() {
        List<Survey> surveys = surveyRepository.findAll();
        return ResponseEntity.ok(surveys);
    }



    // 응답 클래스 정의
    @Data
    @AllArgsConstructor
    static class ErrorResponse {
        private String error;
    }

    @Data
    @AllArgsConstructor
    static class SuccessResponse {
        private String message;
    }

    @Data
    @AllArgsConstructor
    static class SurveyStatusResponse {
        private boolean isCompleted;
    }
}
