// src/main/java/com/server/service/SurveyService.java

package com.server.survey.service;

import com.server.survey.dto.SurveyDTO;
import com.server.survey.model.Survey;
import com.server.auth.model.User;
import com.server.survey.repository.SurveyRepository;
import com.server.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final UserRepository userRepository;

    @Transactional
    public void submitSurvey(User user, SurveyDTO surveyDTO) {
        if (user.isSurveyCompleted()) {
            throw new RuntimeException("이미 설문을 완료했습니다.");
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
    }
}
