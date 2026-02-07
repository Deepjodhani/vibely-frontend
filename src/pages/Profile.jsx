import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { followUser, updateProfile } from "../api/user.api";
import { getUserPosts, likePost, addComment, deletePost, deleteComment, editPost } from "../api/post.api";
import ProfileHeader from "../components/profile/ProfileHeader";
import EditProfile from "../components/profile/EditProfile";
import PostCard from "../components/post/PostCard";
import EditPost from "../components/post/EditPost";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const Profile = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const { socket } = useSocket();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const isOwnProfile = user?._id === id;

  /* ---------------- Following state ---------------- */
  const isFollowing = Boolean(
    profile?.followers?.some((f) => f?._id === user?._id)
  );

  /* ---------------- Load profile ---------------- */
  const loadProfile = useCallback(async () => {
    const res = await api.get(`/users/${id}`);
    setProfile(res.data);
  }, [id]);

  /* ---------------- Load posts ---------------- */
  const loadPosts = useCallback(async () => {
    const data = await getUserPosts(id);
    setPosts(data);
  }, [id]);

  /* ---------------- Initial load ---------------- */
  useEffect(() => {
    let mounted = true;

    setLoading(true);
    Promise.all([loadProfile(), loadPosts()])
      .catch(() => mounted && setProfile(null))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [loadProfile, loadPosts]);

  /* ---------------- Real-time: post updated / deleted (for this profile's posts) ---------------- */
  useEffect(() => {
    if (!socket?.on || !id) return;

    const onNewPost = (post) => {
      const authorId = post?.user?._id || post?.user;
      if (authorId !== id) return;
      setPosts((prev) => {
        if (!post?._id || prev.some((p) => p._id === post._id)) return prev;
        return [post, ...prev];
      });
    };

    const onPostUpdated = (post) => {
      const authorId = post?.user?._id || post?.user;
      if (authorId !== id) return;
      setPosts((prev) =>
        prev.map((p) => (p._id === post?._id ? post : p))
      );
    };

    const onPostDeleted = ({ postId }) => {
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    };

    socket.on("new_post", onNewPost);
    socket.on("post_updated", onPostUpdated);
    socket.on("post_deleted", onPostDeleted);

    return () => {
      socket.off("new_post", onNewPost);
      socket.off("post_updated", onPostUpdated);
      socket.off("post_deleted", onPostDeleted);
    };
  }, [socket, id]);

  /* ---------------- Follow / Unfollow ---------------- */
  const handleFollow = async () => {
    if (!user) return;

    await followUser(id);

    // optimistic UI
    setProfile((prev) => {
      if (!prev) return prev;

      const already = prev.followers.some(
        (f) => f._id === user._id
      );

      return {
        ...prev,
        followers: already
          ? prev.followers.filter(
              (f) => f._id !== user._id
            )
          : [...prev.followers, { _id: user._id }]
      };
    });
  };

  /* ---------------- Like post ---------------- */
  const handleLike = async (postId) => {
    const updatedPost = await likePost(postId);

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? updatedPost : p
      )
    );
  };

  /* ---------------- Comment post ---------------- */
  const handleComment = async (postId, text) => {
    try {
      const updated = await addComment(postId, text);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? updated : p
        )
      );
    } catch (err) {
      console.error("Comment error:", err);
      throw err; // Re-throw so CommentBox can handle it
    }
  };

  /* ---------------- Delete comment ---------------- */
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const updated = await deleteComment(postId, commentId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? updated : p
        )
      );
    } catch (err) {
      console.error("Delete comment error:", err);
      alert("Failed to delete comment");
    }
  };

  /* ---------------- Delete post ---------------- */
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Failed to delete post");
    }
  };

  /* ---------------- Edit post ---------------- */
  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleSaveEdit = async (data) => {
    try {
      const updated = await editPost(editingPost._id, data);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === editingPost._id ? updated : p
        )
      );
      setEditingPost(null);
    } catch (err) {
      console.error("Edit post error:", err);
      alert(err?.response?.data?.message || "Failed to update post");
    }
  };

  /* ---------------- Edit profile ---------------- */
  const handleSaveProfile = async (data) => {
    try {
      const updated = await updateProfile(data);
      setProfile(updated);
      setEditingProfile(false);
      
      // Update auth context if it's own profile
      if (isOwnProfile && user) {
        updateUser(updated);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      throw err; // Let EditProfile handle the error
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <p className="mt-10 text-center text-slate-500">
        Loading profile…
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="mt-10 text-center text-red-500">
        Failed to load profile
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {editingProfile ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <EditProfile
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={() => setEditingProfile(false)}
          />
        </div>
      ) : (
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onEdit={() => setEditingProfile(true)}
          postCount={posts.length}
        />
      )}

      {/* ---------------- Posts ---------------- */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-slate-500">
            No posts yet
          </p>
        ) : (
          posts.map((post) => (
            editingPost?._id === post._id ? (
              <div key={post._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <EditPost
                  post={post}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingPost(null)}
                />
              </div>
            ) : (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onDeleteComment={handleDeleteComment}
                onDeletePost={handleDeletePost}
                onEditPost={handleEditPost}
              />
            )
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
