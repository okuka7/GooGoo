import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchApplicationsByPost,
  updateApplicationStatus,
} from "../../store/applicationSlice";
import SurveyPopup from "../survey/SurveyPopup"; // ✅ SurveyPopup 임포트
import "./ApplicationList.css";

const ApplicantList = ({ postId }) => {
  const dispatch = useDispatch();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [surveyModalOpen, setSurveyModalOpen] = useState(false); // 설문 모달 상태
  const [currentApplicantId, setCurrentApplicantId] = useState(null); // 현재 신청자 ID

  useEffect(() => {
    dispatch(fetchApplicationsByPost(postId))
      .unwrap()
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.error);
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

  const handleViewSurvey = (applicantId) => {
    setCurrentApplicantId(applicantId);
    setSurveyModalOpen(true);
  };

  const closeSurveyModal = () => {
    setSurveyModalOpen(false);
    setCurrentApplicantId(null);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (applications.length === 0) return <p>신청자가 없습니다.</p>;

  return (
    <div>
      <h4>신청자 목록</h4>
      <ul className="applicant-list">
        {applications.map((app) => (
          <li key={app.id} className="applicant-item">
            <button onClick={() => handleViewSurvey(app.applicantId)}>
              {app.applicantNickname}
            </button>{" "}
            - 상태: {app.status}
            {app.status === "PENDING" && (
              <div className="status-buttons">
                <button onClick={() => handleStatusChange(app.id, "ACCEPTED")}>
                  승인
                </button>
                <button onClick={() => handleStatusChange(app.id, "REJECTED")}>
                  거절
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {surveyModalOpen && (
        <SurveyPopup
          isOpen={surveyModalOpen}
          onClose={closeSurveyModal}
          applicantId={currentApplicantId}
        />
      )}
    </div>
  );
};

export default ApplicantList;
