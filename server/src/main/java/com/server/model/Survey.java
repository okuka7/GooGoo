// src/main/java/com/server/model/Survey.java

package com.server.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "surveys")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Survey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 기존 필드
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

    // 추가된 필드
    private String housingTypeOther;
    private String occupationOther;
    private String petPurposeOther;
    private String specialRequirementsDetail;

    @OneToOne(mappedBy = "survey")
    @JsonBackReference // 추가
    private User user;
}
