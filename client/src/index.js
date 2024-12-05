// src/index.js

import React from "react";
import ReactDOM from "react-dom/client"; // React 18의 새로운 API 사용
import App from "./App";
import "./styles/main.css"; // 글로벌 스타일
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "normalize.css"; // Normalize.css 임포트
import "./styles/main.css"; // 글로벌 스타일 임포트

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container); // createRoot 사용

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
