import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/authSlice";
import "./Login.css";

const Login = ({ switchToSignup }) => {
  // switchToSignup prop 추가
  const [form, setForm] = useState({ username: "", password: "" }); // username으로 변경
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="auth-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디:</label> {/* "이메일"에서 "아이디"로 변경 */}
          <input
            type="text" // email에서 text로 변경
            name="username" // name 속성을 username으로 변경
            value={form.username} // state에서도 username 사용
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {loading && <p>로그인 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          로그인
        </button>
      </form>
      <p>
        아직 계정이 없으신가요?{" "}
        <button className="switch-button" onClick={switchToSignup}>
          회원가입
        </button>
      </p>
    </div>
  );
};

export default Login;
