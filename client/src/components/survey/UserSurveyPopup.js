// src/components/survey/UserSurveyPopup.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSurveyByUserId, clearSurveyData } from "../../store/surveySlice";
import "./UserSurveyPopup.css"; // 스타일 파일 임포트

const UserSurveyPopup = ({ isOpen, onClose, userId }) => {
  // applicantId -> userId
  const dispatch = useDispatch();
  const { surveyData, loading, error } = useSelector((state) => state.survey);

  useEffect(() => {
    console.log("Survey Popup Opened:", isOpen, "User ID:", userId);
    if (isOpen && userId) {
      dispatch(fetchSurveyByUserId(userId));
    }
    return () => {
      dispatch(clearSurveyData());
    };
  }, [isOpen, userId, dispatch]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = () => {
    onClose();
  };

  // 모달 내용 클릭 시 이벤트 전파 방지
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="survey-popup-overlay" onClick={handleOverlayClick}>
      <div className="survey-popup-content" onClick={handleContentClick}>
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>설문 정보</h2>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {surveyData && typeof surveyData === "object" ? (
          <div className="survey-data">
            <p>
              <strong>반려동물 유무:</strong> {surveyData.hasPet}
            </p>
            <p>
              <strong>반려동물 종류:</strong> {surveyData.petType}
            </p>
            <p>
              <strong>반려동물 수:</strong> {surveyData.numberOfPets}
            </p>
            <p>
              <strong>반려동물 양육 경험:</strong> {surveyData.hasPetExperience}
            </p>
            <p>
              <strong>경험 종류:</strong> {surveyData.petExperienceType}
            </p>
            <p>
              <strong>주거 형태:</strong> {surveyData.housingType}
            </p>
            <p>
              <strong>가구 구성원:</strong> {surveyData.householdMembers}
            </p>
            <p>
              <strong>연령대:</strong> {surveyData.ageGroup}
            </p>
            <p>
              <strong>직업:</strong> {surveyData.occupation}
            </p>
            <p>
              <strong>반려동물 목적:</strong> {surveyData.petPurpose}
            </p>
            <p>
              <strong>예산:</strong> {surveyData.petBudget}
            </p>
            <p>
              <strong>특별 요구사항:</strong> {surveyData.specialRequirements}
            </p>
          </div>
        ) : (
          !loading && !error && <p>설문 정보가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default UserSurveyPopup;
