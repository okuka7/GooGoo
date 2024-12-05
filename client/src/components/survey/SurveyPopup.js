// src/components/survey/SurveyPopup.js

import React, { useState } from "react";
import Modal from "react-modal";
import api from "../../api/api";
import "./SurveyPopup.css"; // 스타일 파일

Modal.setAppElement("#root");

const SurveyPopup = ({ isOpen, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    hasPet: "",
    petType: "",
    numberOfPets: "",
    hasPetExperience: "",
    petExperienceType: "",
    housingType: "",
    housingTypeOther: "",
    householdMembers: "",
    ageGroup: "",
    occupation: "",
    occupationOther: "",
    petPurpose: "",
    petPurposeOther: "",
    petBudget: "",
    specialRequirements: "",
    specialRequirementsDetail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/survey", formData);
      onSubmit(); // 설문 제출 후 팝업 닫기
      alert("설문이 성공적으로 제출되었습니다!");
    } catch (error) {
      console.error("설문 제출 오류:", error);
      alert("설문 제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleNextTime = () => {
    onClose(); // 다음에 할게요 클릭 시 팝업 닫기
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose} // ESC 키 또는 오버레이 클릭 시 모달 닫힘
      contentLabel="설문지"
      className="SurveyModal"
      overlayClassName="SurveyOverlay"
    >
      <h2>설문지 작성</h2>
      <form onSubmit={handleSubmit}>
        {/* 1. 현재 반려동물을 키우고 계신가요? */}
        <div className="survey-question">
          <label>1. 현재 반려동물을 키우고 계신가요?</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="hasPetYes"
                name="hasPet"
                value="예"
                onChange={handleChange}
                required
              />
              <label htmlFor="hasPetYes">예</label>
              {formData.hasPet === "예" && (
                <input
                  type="text"
                  name="petType"
                  placeholder="어떤 동물을 키우시나요?"
                  value={formData.petType}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="hasPetNo"
                name="hasPet"
                value="아니요"
                onChange={handleChange}
                required
              />
              <label htmlFor="hasPetNo">아니요</label>
            </div>
          </div>
        </div>

        {/* 2. 반려동물을 몇 마리 키우시나요? */}
        <div className="survey-question">
          <label>2. 반려동물을 몇 마리 키우시나요?</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="numberOfPets1"
                name="numberOfPets"
                value="1마리"
                onChange={handleChange}
                required
              />
              <label htmlFor="numberOfPets1">1마리</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="numberOfPets2"
                name="numberOfPets"
                value="2마리"
                onChange={handleChange}
                required
              />
              <label htmlFor="numberOfPets2">2마리</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="numberOfPets3"
                name="numberOfPets"
                value="3마리 이상"
                onChange={handleChange}
                required
              />
              <label htmlFor="numberOfPets3">3마리 이상</label>
            </div>
          </div>
        </div>

        {/* 3. 반려동물을 키운 경험이 있으신가요? */}
        <div className="survey-question">
          <label>3. 반려동물을 키운 경험이 있으신가요?</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="hasPetExperienceYes"
                name="hasPetExperience"
                value="예"
                onChange={handleChange}
                required
              />
              <label htmlFor="hasPetExperienceYes">예</label>
              {formData.hasPetExperience === "예" && (
                <input
                  type="text"
                  name="petExperienceType"
                  placeholder="어떤 동물을 키우셨나요?"
                  value={formData.petExperienceType}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="hasPetExperienceNo"
                name="hasPetExperience"
                value="아니요"
                onChange={handleChange}
                required
              />
              <label htmlFor="hasPetExperienceNo">아니요</label>
            </div>
          </div>
        </div>

        {/* 4. 거주하시는 주택 유형은 무엇인가요? */}
        <div className="survey-question">
          <label>4. 거주하시는 주택 유형은 무엇인가요?</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="housingType1"
                name="housingType"
                value="원룸"
                onChange={handleChange}
                required
              />
              <label htmlFor="housingType1">원룸</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="housingType2"
                name="housingType"
                value="투룸 이상"
                onChange={handleChange}
                required
              />
              <label htmlFor="housingType2">투룸 이상</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="housingType3"
                name="housingType"
                value="아파트"
                onChange={handleChange}
                required
              />
              <label htmlFor="housingType3">아파트</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="housingType4"
                name="housingType"
                value="단독주택"
                onChange={handleChange}
                required
              />
              <label htmlFor="housingType4">단독주택</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="housingType5"
                name="housingType"
                value="기타"
                onChange={handleChange}
                required
              />
              <label htmlFor="housingType5">기타</label>
              {formData.housingType === "기타" && (
                <input
                  type="text"
                  name="housingTypeOther"
                  placeholder="직접 입력"
                  value={formData.housingTypeOther}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          </div>
        </div>

        {/* 5. 거주 인원은 몇 명인가요? */}
        <div className="survey-question">
          <label>5. 거주 인원은 몇 명인가요?</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="householdMembers1"
                name="householdMembers"
                value="혼자"
                onChange={handleChange}
                required
              />
              <label htmlFor="householdMembers1">혼자</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="householdMembers2"
                name="householdMembers"
                value="가족과 함께"
                onChange={handleChange}
                required
              />
              <label htmlFor="householdMembers2">가족과 함께</label>
            </div>
          </div>
        </div>

        {/* 6. 연령대를 선택해주세요: */}
        <div className="survey-question">
          <label>6. 연령대를 선택해주세요:</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="ageGroup1"
                name="ageGroup"
                value="20대 이하"
                onChange={handleChange}
                required
              />
              <label htmlFor="ageGroup1">20대 이하</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="ageGroup2"
                name="ageGroup"
                value="30대"
                onChange={handleChange}
                required
              />
              <label htmlFor="ageGroup2">30대</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="ageGroup3"
                name="ageGroup"
                value="40대 이상"
                onChange={handleChange}
                required
              />
              <label htmlFor="ageGroup3">40대 이상</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="ageGroup4"
                name="ageGroup"
                value="기타"
                onChange={handleChange}
                required
              />
              <label htmlFor="ageGroup4">기타</label>
            </div>
          </div>
        </div>

        {/* 7. 직업을 알려주세요: */}
        <div className="survey-question">
          <label>7. 직업을 알려주세요:</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="occupation1"
                name="occupation"
                value="학생"
                onChange={handleChange}
                required
              />
              <label htmlFor="occupation1">학생</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="occupation2"
                name="occupation"
                value="직장인"
                onChange={handleChange}
                required
              />
              <label htmlFor="occupation2">직장인</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="occupation3"
                name="occupation"
                value="프리랜서"
                onChange={handleChange}
                required
              />
              <label htmlFor="occupation3">프리랜서</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="occupation4"
                name="occupation"
                value="무직"
                onChange={handleChange}
                required
              />
              <label htmlFor="occupation4">무직</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="occupation5"
                name="occupation"
                value="기타"
                onChange={handleChange}
                required
              />
              <label htmlFor="occupation5">기타</label>
              {formData.occupation === "기타" && (
                <input
                  type="text"
                  name="occupationOther"
                  placeholder="직접 입력"
                  value={formData.occupationOther}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          </div>
        </div>

        {/* 8. 반려동물을 키우는 목적은 무엇인가요? */}
        <div className="survey-question">
          <label>8. 반려동물을 키우는 목적은 무엇인가요?</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="petPurpose1"
                name="petPurpose"
                value="가족 구성원으로"
                onChange={handleChange}
                required
              />
              <label htmlFor="petPurpose1">가족 구성원으로</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="petPurpose2"
                name="petPurpose"
                value="보호 목적으로"
                onChange={handleChange}
                required
              />
              <label htmlFor="petPurpose2">보호 목적으로</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="petPurpose3"
                name="petPurpose"
                value="기타"
                onChange={handleChange}
                required
              />
              <label htmlFor="petPurpose3">기타</label>
              {formData.petPurpose === "기타" && (
                <input
                  type="text"
                  name="petPurposeOther"
                  placeholder="직접 입력"
                  value={formData.petPurposeOther}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          </div>
        </div>

        {/* 9. 반려동물 유지에 대한 예산을 설정해주세요: */}
        <div className="survey-question">
          <label>9. 반려동물 유지에 대한 예산을 설정해주세요:</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="petBudget1"
                name="petBudget"
                value="월 10만 원 이하"
                onChange={handleChange}
                required
              />
              <label htmlFor="petBudget1">월 10만 원 이하</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="petBudget2"
                name="petBudget"
                value="월 10만 원 ~ 30만 원"
                onChange={handleChange}
                required
              />
              <label htmlFor="petBudget2">월 10만 원 ~ 30만 원</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="petBudget3"
                name="petBudget"
                value="월 30만 원 이상"
                onChange={handleChange}
                required
              />
              <label htmlFor="petBudget3">월 30만 원 이상</label>
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="petBudget4"
                name="petBudget"
                value="예산 미정"
                onChange={handleChange}
                required
              />
              <label htmlFor="petBudget4">예산 미정</label>
            </div>
          </div>
        </div>

        {/* 10. 특별한 요구 사항이 있으신가요? */}
        <div className="survey-question">
          <label>10. 특별한 요구 사항이 있으신가요?</label>
          <div className="survey-options">
            <div className="option-item">
              <input
                type="radio"
                id="specialRequirementsYes"
                name="specialRequirements"
                value="예"
                onChange={handleChange}
                required
              />
              <label htmlFor="specialRequirementsYes">예</label>
              {formData.specialRequirements === "예" && (
                <input
                  type="text"
                  name="specialRequirementsDetail"
                  placeholder="구체적으로 작성해주세요"
                  value={formData.specialRequirementsDetail}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
            <div className="option-item">
              <input
                type="radio"
                id="specialRequirementsNo"
                name="specialRequirements"
                value="아니요"
                onChange={handleChange}
                required
              />
              <label htmlFor="specialRequirementsNo">아니요</label>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button">
            저장
          </button>
          <span className="next-time-text" onClick={handleNextTime}>
            다음에 할게요
          </span>
        </div>
      </form>
    </Modal>
  );
};

export default SurveyPopup;
