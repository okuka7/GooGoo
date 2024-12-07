// src/pages/EditProfile.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserInfo,
  fetchUserInfo,
  fetchSurvey,
  updateSurvey,
} from "../store/authSlice"; // 올바른 액션 임포트
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, survey, loading, error } = useSelector((state) => state.auth);

  // 프로필 상태
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 설문 상태
  const [surveyData, setSurveyData] = useState({
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

  // 프로필 정보 설정
  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
    }
  }, [user]);

  // 설문 정보 가져오기
  useEffect(() => {
    if (user) {
      dispatch(fetchSurvey());
    }
  }, [dispatch, user]);

  // 설문 데이터 설정
  useEffect(() => {
    if (survey) {
      setSurveyData({
        ...surveyData, // 기존 데이터 유지
        ...survey, // 새 데이터 덮어쓰기
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey]);

  // 프로필 수정 핸들러
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호가 비어있지 않으면 변경, 그렇지 않으면 비밀번호는 제외
    const updateProfileData = { nickname };
    if (password) {
      updateProfileData.password = password;
    }

    try {
      // 프로필 정보 업데이트
      await dispatch(updateUserInfo(updateProfileData)).unwrap();
      // 사용자 정보 다시 가져오기
      dispatch(fetchUserInfo());
      alert("프로필이 성공적으로 수정되었습니다!");
      // 비밀번호 필드 초기화
      setPassword("");
      setConfirmPassword("");
      // 마이페이지로 리디렉션
      navigate("/mypage");
    } catch (err) {
      console.error("프로필 수정 실패:", err);
    }
  };

  // 설문 수정 핸들러
  const handleSurveyChange = (e) => {
    const { name, value } = e.target;
    setSurveyData({ ...surveyData, [name]: value });
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    try {
      // 설문 데이터 업데이트
      await dispatch(updateSurvey(surveyData)).unwrap();
      alert("설문이 성공적으로 수정되었습니다!");
      // 마이페이지로 리디렉션
      navigate("/mypage");
    } catch (err) {
      console.error("설문 수정 실패:", err);
    }
  };

  return (
    <div className="edit-profile-container">
      <h1>프로필 수정</h1>

      {/* 프로필 수정 폼 */}
      <form onSubmit={handleProfileSubmit}>
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">새 비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 변경하려면 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>
        {loading && <p>업데이트 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "업데이트 중..." : "프로필 수정 완료"}
        </button>
      </form>

      {/* 구분선 */}
      <hr className="separator" />

      {/* 설문 수정 폼 */}
      <h2>설문 수정</h2>
      <form onSubmit={handleSurveySubmit}>
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
                checked={surveyData.hasPet === "예"}
                onChange={handleSurveyChange}
                required
              />
              <label htmlFor="hasPetYes">예</label>
              {surveyData.hasPet === "예" && (
                <input
                  type="text"
                  name="petType"
                  placeholder="어떤 동물을 키우시나요?"
                  value={surveyData.petType}
                  onChange={handleSurveyChange}
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
                checked={surveyData.hasPet === "아니요"}
                onChange={handleSurveyChange}
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
                checked={surveyData.numberOfPets === "1마리"}
                onChange={handleSurveyChange}
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
                checked={surveyData.numberOfPets === "2마리"}
                onChange={handleSurveyChange}
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
                checked={surveyData.numberOfPets === "3마리 이상"}
                onChange={handleSurveyChange}
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
                checked={surveyData.hasPetExperience === "예"}
                onChange={handleSurveyChange}
                required
              />
              <label htmlFor="hasPetExperienceYes">예</label>
              {surveyData.hasPetExperience === "예" && (
                <input
                  type="text"
                  name="petExperienceType"
                  placeholder="어떤 동물을 키우셨나요?"
                  value={surveyData.petExperienceType}
                  onChange={handleSurveyChange}
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
                checked={surveyData.hasPetExperience === "아니요"}
                onChange={handleSurveyChange}
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
                checked={surveyData.housingType === "원룸"}
                onChange={handleSurveyChange}
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
                checked={surveyData.housingType === "투룸 이상"}
                onChange={handleSurveyChange}
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
                checked={surveyData.housingType === "아파트"}
                onChange={handleSurveyChange}
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
                checked={surveyData.housingType === "단독주택"}
                onChange={handleSurveyChange}
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
                checked={surveyData.housingType === "기타"}
                onChange={handleSurveyChange}
                required
              />
              <label htmlFor="housingType5">기타</label>
              {surveyData.housingType === "기타" && (
                <input
                  type="text"
                  name="housingTypeOther"
                  placeholder="직접 입력"
                  value={surveyData.housingTypeOther || ""}
                  onChange={handleSurveyChange}
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
                checked={surveyData.householdMembers === "혼자"}
                onChange={handleSurveyChange}
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
                checked={surveyData.householdMembers === "가족과 함께"}
                onChange={handleSurveyChange}
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
                checked={surveyData.ageGroup === "20대 이하"}
                onChange={handleSurveyChange}
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
                checked={surveyData.ageGroup === "30대"}
                onChange={handleSurveyChange}
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
                checked={surveyData.ageGroup === "40대 이상"}
                onChange={handleSurveyChange}
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
                checked={surveyData.ageGroup === "기타"}
                onChange={handleSurveyChange}
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
                checked={surveyData.occupation === "학생"}
                onChange={handleSurveyChange}
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
                checked={surveyData.occupation === "직장인"}
                onChange={handleSurveyChange}
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
                checked={surveyData.occupation === "프리랜서"}
                onChange={handleSurveyChange}
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
                checked={surveyData.occupation === "무직"}
                onChange={handleSurveyChange}
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
                checked={surveyData.occupation === "기타"}
                onChange={handleSurveyChange}
                required
              />
              <label htmlFor="occupation5">기타</label>
              {surveyData.occupation === "기타" && (
                <input
                  type="text"
                  name="occupationOther"
                  placeholder="직접 입력"
                  value={surveyData.occupationOther || ""}
                  onChange={handleSurveyChange}
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
                checked={surveyData.petPurpose === "가족 구성원으로"}
                onChange={handleSurveyChange}
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
                checked={surveyData.petPurpose === "보호 목적으로"}
                onChange={handleSurveyChange}
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
                checked={surveyData.petPurpose === "기타"}
                onChange={handleSurveyChange}
                required
              />
              <label htmlFor="petPurpose3">기타</label>
              {surveyData.petPurpose === "기타" && (
                <input
                  type="text"
                  name="petPurposeOther"
                  placeholder="직접 입력"
                  value={surveyData.petPurposeOther || ""}
                  onChange={handleSurveyChange}
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
                checked={surveyData.petBudget === "월 10만 원 이하"}
                onChange={handleSurveyChange}
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
                checked={surveyData.petBudget === "월 10만 원 ~ 30만 원"}
                onChange={handleSurveyChange}
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
                checked={surveyData.petBudget === "월 30만 원 이상"}
                onChange={handleSurveyChange}
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
                checked={surveyData.petBudget === "예산 미정"}
                onChange={handleSurveyChange}
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
                checked={surveyData.specialRequirements === "예"}
                onChange={handleSurveyChange}
                required
              />
              <label htmlFor="specialRequirementsYes">예</label>
              {surveyData.specialRequirements === "예" && (
                <input
                  type="text"
                  name="specialRequirementsDetail"
                  placeholder="구체적으로 작성해주세요"
                  value={surveyData.specialRequirementsDetail || ""}
                  onChange={handleSurveyChange}
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
                checked={surveyData.specialRequirements === "아니요"}
                onChange={handleSurveyChange}
                required
              />
              <label htmlFor="specialRequirementsNo">아니요</label>
            </div>
          </div>
        </div>

        {loading && <p>업데이트 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "업데이트 중..." : "설문 수정 완료"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
