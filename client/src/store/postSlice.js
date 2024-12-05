// src/store/postSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Thunk for fetching all posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/posts");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "게시물 로드 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Thunk for fetching user's posts
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/me/posts");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "사용자 게시글 로드 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Thunk for creating a post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, thunkAPI) => {
    try {
      const response = await api.post("/posts", postData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "게시물 생성 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Thunk for updating a post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, postData }, thunkAPI) => {
    try {
      const response = await api.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "게시물 수정 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Thunk for deleting a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      await api.delete(`/posts/${postId}`);
      return postId;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "게시물 삭제 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    userPosts: [], // 사용자 게시글을 저장할 별도의 상태
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "게시물 로드 실패";
      })
      // Fetch User's Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "사용자 게시글 로드 실패";
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.userPosts.unshift(action.payload); // 사용자 게시글에도 추가
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "게시물 생성 실패";
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        const userIndex = state.userPosts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (userIndex !== -1) {
          state.userPosts[userIndex] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "게시물 수정 실패";
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        state.userPosts = state.userPosts.filter(
          (post) => post.id !== action.payload
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "게시물 삭제 실패";
      });
  },
});

export default postSlice.reducer;
