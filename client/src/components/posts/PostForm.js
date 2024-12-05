import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../store/postSlice";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostForm.css";

const PostForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { posts } = useSelector((state) => state.posts);

  const editingPost = postId
    ? posts.find((p) => p.id === parseInt(postId))
    : null;

  const [title, setTitle] = useState(editingPost ? editingPost.title : "");
  const [content, setContent] = useState(
    editingPost ? editingPost.content : ""
  );
  const [animalType, setAnimalType] = useState(
    editingPost ? editingPost.animalType : ""
  );
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    const post = {
      title,
      content,
      animalType,
    };
    formData.append(
      "post",
      new Blob([JSON.stringify(post)], { type: "application/json" })
    );
    if (image) formData.append("image", image);

    dispatch(createPost(formData))
      .unwrap()
      .then((newPost) => navigate(`/posts/${newPost.id}`))
      .catch((error) => {
        console.error("게시물 생성 실패:", error);
      });
  };

  return (
    <div className="post-form-container">
      <h2>{editingPost ? "게시물 수정" : "게시물 작성"}</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <label>
          제목:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          반려동물 종류:
          <input
            type="text"
            value={animalType}
            onChange={(e) => setAnimalType(e.target.value)}
            required
          />
        </label>
        <label>
          내용:
          <ReactQuill value={content} onChange={setContent} />
        </label>
        <label>
          이미지 업로드:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
        <button type="submit">{editingPost ? "수정하기" : "등록하기"}</button>
      </form>
    </div>
  );
};

export default PostForm;
