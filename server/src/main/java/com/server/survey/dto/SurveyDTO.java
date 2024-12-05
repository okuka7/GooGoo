// src/main/java/com/server/dto/SurveyDTO.java

package com.server.survey.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyDTO {
    private String hasPet;
    private String petType;
    private String numberOfPets;
    private String hasPetExperience;
    private String petExperienceType;
    private String housingType;
    private String householdMembers;
    private String ageGroup;
    private String occupation;
    private String petPurpose;
    private String petBudget;
    private String specialRequirements;
}
