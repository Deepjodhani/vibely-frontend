import api from "./axios";

export const followUser = async (userId) => {
  const res = await api.put(`/users/follow/${userId}`);
  return res.data;
};

export const searchUsers = async (query) => {
  const res = await api.get(`/users/search?q=${query}`);
  return res.data;
};

// ✅ UPDATE PROFILE
export const updateProfile = async (data) => {
  const formData = new FormData();
  if (data.username !== undefined) {
    formData.append("username", data.username);
  }
  if (data.bio !== undefined) {
    formData.append("bio", data.bio);
  }
  if (data.profilePic) {
    formData.append("profilePic", data.profilePic);
  }
  const res = await api.put("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

