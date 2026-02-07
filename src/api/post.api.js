import api from "./axios";

export const getFeedPosts = async () => {
  const res = await api.get("/users/feed");
  return res.data;
};

export const createPost = async (data) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const likePost = async (postId) => {
  const res = await api.put(`/posts/like/${postId}`);
  return res.data;
};

// ✅ ADD COMMENT
export const addComment = async (postId, text) => {
  const res = await api.post(`/posts/comment/${postId}`, {
    text
  });
  return res.data;
};

export const getUserPosts = async (userId) => {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
};

// ✅ DELETE POST
export const deletePost = async (postId) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};

// ✅ DELETE COMMENT
export const deleteComment = async (postId, commentId) => {
  const res = await api.delete(`/posts/comment/${postId}/${commentId}`);
  return res.data;
};

// ✅ EDIT POST
export const editPost = async (postId, data) => {
  const formData = new FormData();
  if (data.content !== undefined) {
    formData.append("content", data.content);
  }
  if (data.image) {
    formData.append("image", data.image);
  }
  if (data.removeImage) {
    formData.append("removeImage", "true");
  }
  const res = await api.put(`/posts/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

