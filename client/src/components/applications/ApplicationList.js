// src/components/applications/ApplicationList.js

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchApplicationsByPost,
  updateApplicationStatus,
} from "../../store/applicationSlice";
import "./ApplicationList.css";
import UserSurveyPopup from "../survey/UserSurveyPopup"; // ✅ UserSurveyPopup 임포트

const ApplicationList = ({ postId }) => {
  const dispatch = useDispatch();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [surveyModalOpen, setSurveyModalOpen] = useState(false); // 설문 모달 상태
  const [currentUserId, setCurrentUserId] = useState(null); // 현재 신청자의 사용자 ID

  useEffect(() => {
    dispatch(fetchApplicationsByPost(postId))
      .unwrap()
      .then((data) => {
        console.log("Fetched Applications:", data); // 콘솔 로그 추가
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Applications Error:", err); // 콘솔 로그 추가
        setError(err.error || "신청자 정보를 가져오는 데 실패했습니다.");
        setLoading(false);
      });
  }, [dispatch, postId]);

  const handleStatusChange = (applicationId, status) => {
    dispatch(updateApplicationStatus({ applicationId, status }))
      .unwrap()
      .then(() => {
        alert(`신청 상태가 ${status}로 변경되었습니다.`);
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app.id === applicationId ? { ...app, status } : app
          )
        );
      })
      .catch((error) => alert(error));
  };

  const handleViewSurvey = (userId) => {
    console.log("Opening Survey for User ID:", userId); // 콘솔 로그 추가
    setCurrentUserId(userId);
    setSurveyModalOpen(true);
  };

  const closeSurveyModal = () => {
    console.log("Closing Survey Modal"); // 콘솔 로그 추가
    setSurveyModalOpen(false);
    setCurrentUserId(null);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (applications.length === 0) return <p>신청자가 없습니다.</p>;

  return (
    <div>
      <h4>신청자 목록</h4>
      <ul className="applicant-list">
        {applications.map((app) => {
          console.log("Application Item:", app); // 콘솔 로그 추가
          const userId = app.userId; // 애플리케이션 객체에서 사용자 ID 추출
          if (!userId) {
            console.warn(`User ID is missing for application ID: ${app.id}`);
          }
          return (
            <li key={app.id} className="applicant-item">
              <button onClick={() => handleViewSurvey(userId)}>
                {app.applicantNickname}
              </button>{" "}
              - 상태: {app.status}
              {app.status === "PENDING" && (
                <div className="status-buttons">
                  <button
                    onClick={() => handleStatusChange(app.id, "ACCEPTED")}
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleStatusChange(app.id, "REJECTED")}
                  >
                    거절
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {surveyModalOpen && (
        <UserSurveyPopup
          userId={currentUserId} // 수정된 prop 이름과 전달 값
          isOpen={surveyModalOpen}
          onClose={closeSurveyModal}
        />
      )}
    </div>
  );
};

export default ApplicationList;
