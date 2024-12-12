import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../api/api";
import "./MyAdoptions.css";

const MyAdoptions = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [adoptions, setAdoptions] = useState([]);
  const [newCareNote, setNewCareNote] = useState("");
  const [selectedAdoptionId, setSelectedAdoptionId] = useState(null);

  useEffect(() => {
    const fetchAdoptions = async () => {
      if (isAuthenticated) {
        try {
          const res = await api.get("/adoptions/user");
          setAdoptions(res.data);
        } catch (error) {
          console.error("입양 기록 조회 실패:", error);
        }
      }
    };
    fetchAdoptions();
  }, [isAuthenticated]);

  const handleCareSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdoptionId || !newCareNote.trim()) return;

    try {
      await api.post(`/carelogs/${selectedAdoptionId}`, {
        note: newCareNote,
      });
      setNewCareNote("");
      setSelectedAdoptionId(null);
      // CareLog 추가 후 다시 리스트 갱신
      const res = await api.get("/adoptions/user");
      setAdoptions(res.data);
    } catch (error) {
      console.error("케어 로그 작성 실패:", error);
    }
  };

  return (
    <div className="myadoptions-container">
      <h1>내 입양 기록</h1>
      {adoptions.length === 0 ? (
        <p>아직 입양 기록이 없습니다.</p>
      ) : (
        adoptions.map((adoption) => (
          <div key={adoption.id} className="adoption-record-card">
            <p>입양 기록 ID: {adoption.id}</p>
            <p>반려동물 Post ID: {adoption.postId}</p>
            <p>
              책임 달성 여부:{" "}
              {adoption.responsibleAchieved ? "달성 완료" : "미달성"}
            </p>
            {!adoption.responsibleAchieved && (
              <button
                onClick={() => setSelectedAdoptionId(adoption.id)}
                className="carelog-button"
              >
                케어 로그 작성하기
              </button>
            )}
          </div>
        ))
      )}

      {selectedAdoptionId && (
        <div className="carelog-form-container">
          <h2>케어 로그 작성</h2>
          <form onSubmit={handleCareSubmit}>
            <textarea
              placeholder="케어 기록을 입력하세요..."
              value={newCareNote}
              onChange={(e) => setNewCareNote(e.target.value)}
              className="carelog-textarea"
            />
            <div className="carelog-form-buttons">
              <button type="submit" className="carelog-submit">
                제출
              </button>
              <button
                type="button"
                className="carelog-cancel"
                onClick={() => {
                  setSelectedAdoptionId(null);
                  setNewCareNote("");
                }}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyAdoptions;
