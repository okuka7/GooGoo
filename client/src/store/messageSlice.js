// src/store/messageSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// 비동기 Thunk 액션들

// 특정 사용자와의 대화 불러오기
export const fetchConversation = createAsyncThunk(
  "messages/fetchConversation",
  async (otherUsername, { rejectWithValue }) => {
    try {
      const response = await api.get(`/messages/${otherUsername}`); // 올바른 경로
      return response.data; // 메시지 배열 예상
    } catch (e) {
      return rejectWithValue(e.response?.data?.error || "대화 불러오기 실패");
    }
  }
);

// 메시지 보내기
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ receiverUsername, content }, { rejectWithValue }) => {
    try {
      // receiverUsername 필드가 누락되었거나 빈 문자열이라면 에러 반환
      if (!receiverUsername || receiverUsername.trim() === "") {
        return rejectWithValue("수신자 사용자명을 입력해주세요.");
      }
      if (!content || content.trim() === "") {
        return rejectWithValue("메시지 내용을 입력해주세요.");
      }

      const response = await api.post("/messages", {
        receiverUsername,
        content,
      });
      return response.data; // 새로 전송된 메시지 DTO 예상
    } catch (e) {
      return rejectWithValue(e.response?.data?.error || "메시지 전송 실패");
    }
  }
);

// 읽지 않은 메시지 수 가져오기
export const fetchUnreadCount = createAsyncThunk(
  "messages/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/messages/unread-count");
      return response.data.count; // 숫자 예상
    } catch (e) {
      return rejectWithValue("읽지 않은 메시지 수 가져오기 실패");
    }
  }
);

// Redux Slice 정의
const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [], // 현재 대화의 메시지 목록
    unreadCount: 0, // 전체 읽지 않은 메시지 수
    loading: false, // 로딩 상태
    error: null, // 에러 메시지
  },
  reducers: {
    // WebSocket을 통해 수신된 메시지를 추가하는 리듀서
    addMessage: (state, action) => {
      const message = action.payload;
      state.messages.push(message);

      // 메시지가 현재 사용자가 받는 메시지라면 unreadCount 증가
      // 현재 사용자의 username을 auth 스토어에서 가져와야 합니다.
      // 하지만 슬라이스에서는 다른 슬라이스의 상태에 접근할 수 없으므로,
      // 메시지를 보낼 때 또는 WebSocket 핸들러에서 unreadCount를 별도로 관리해야 합니다.
      // 여기서는 단순히 unreadCount를 증가시키는 로직을 추가하지 않습니다.
    },

    // 메시지 상태를 초기화하는 리듀서 (선택사항)
    resetMessages: (state) => {
      state.messages = [];
      state.unreadCount = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConversation Thunk 처리
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload; // 대화 메시지 배열로 설정
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // sendMessage Thunk 처리
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); // 새로 보낸 메시지를 메시지 목록에 추가
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchUnreadCount Thunk 처리
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export Actions
export const { addMessage, resetMessages } = messageSlice.actions;

// Export Reducer
export default messageSlice.reducer;
