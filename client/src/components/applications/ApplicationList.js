// src/components/applications/ApplicationList.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplicationsByPost,
  updateApplicationStatus,
} from "../../store/applicationSlice";
import { useNavigate } from "react-router-dom";
import "./ApplicationList.css";
import UserSurveyPopup from "../survey/UserSurveyPopup";

const ApplicationList = ({ postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const applications = useSelector(
    (state) => state.applications.applicationsByPost[postId] || []
  );
  const loading = useSelector((state) => state.applications.loading);
  const error = useSelector((state) => state.applications.error);

  const [surveyModalOpen, setSurveyModalOpen] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState(null);

  useEffect(() => {
    dispatch(fetchApplicationsByPost(postId))
      .unwrap()
      .then((data) => {
        console.log("Fetched Applications:", data);
      })
      .catch((err) => {
        console.error("Fetch Applications Error:", err);
      });
  }, [dispatch, postId]);

  const handleStatusChange = (applicationId, status) => {
    dispatch(updateApplicationStatus({ postId, applicationId, status }))
      .unwrap()
      .then(() => {
        alert(`신청 상태가 ${status}로 변경되었습니다.`);
      })
      .catch((error) => alert(error));
  };

  const handleViewSurvey = (userId) => {
    console.log("Opening Survey for User ID:", userId);
    setCurrentUserId(userId);
    setSurveyModalOpen(true);
  };

  const closeSurveyModal = () => {
    console.log("Closing Survey Modal");
    setSurveyModalOpen(false);
    setCurrentUserId(null);
  };

  const handleSendMessage = (username) => {
    if (!username) {
      alert("유효한 사용자를 선택해주세요.");
      return;
    }
    navigate(`/messages/${username}`);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (applications.length === 0) return <p>신청자가 없습니다.</p>;

  return (
    <div>
      <h4>신청자 목록</h4>
      <ul className="applicant-list">
        {applications.map((app) => {
          console.log("Application Item:", app);
          const userId = app.userId;
          const applicantUsername = app.applicantUsername; // 이 필드가 존재하는지 확인
          if (!userId) {
            console.warn(`User ID가 누락된 신청 ID: ${app.id}`);
          }
          if (!applicantUsername) {
            console.warn(`Applicant Username이 누락된 신청 ID: ${app.id}`);
          }
          return (
            <li key={app.id} className="applicant-item">
              <div className="applicant-info">
                <button onClick={() => handleViewSurvey(userId)}>
                  {app.applicantNickname}
                </button>{" "}
                - 상태: {app.status}
              </div>
              <div className="action-buttons">
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
                <button
                  className="message-button"
                  onClick={() => handleSendMessage(applicantUsername)}
                >
                  메시지 보내기
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {surveyModalOpen && (
        <UserSurveyPopup
          userId={currentUserId}
          isOpen={surveyModalOpen}
          onClose={closeSurveyModal}
        />
      )}
    </div>
  );
};

export default ApplicationList;
