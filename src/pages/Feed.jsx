import { useEffect, useState } from "react";
import {
  getFeedPosts,
  likePost,
  addComment,
  deletePost,
  deleteComment,
  editPost
} from "../api/post.api";
import { useSocket } from "../context/SocketContext";

import CreatePost from "../components/post/CreatePost";
import PostCard from "../components/post/PostCard";
import EditPost from "../components/post/EditPost";

const Feed = () => {
  const { socket } = useSocket();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  /* ------------------------------------
     Load feed
  ------------------------------------ */
  const loadFeed = async () => {
    try {
      const data = await getFeedPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  /* ------------------------------------
     Real-time: new post, post updated, post deleted
  ------------------------------------ */
  useEffect(() => {
    if (!socket?.on) return;

    const onNewPost = (post) => {
      setPosts((prev) => {
        if (!post?._id || prev.some((p) => p._id === post._id)) return prev;
        return [post, ...prev];
      });
    };

    const onPostUpdated = (post) => {
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
  }, [socket]);

  /* ------------------------------------
     Like post
  ------------------------------------ */
  const handleLike = async (postId) => {
    const updated = await likePost(postId);
    setPosts(
      posts.map((p) =>
        p._id === postId ? updated : p
      )
    );
  };

  /* ------------------------------------
     Comment on post
  ------------------------------------ */
  const handleComment = async (postId, text) => {
    const updated = await addComment(postId, text);
    setPosts(
      posts.map((p) =>
        p._id === postId ? updated : p
      )
    );
  };

  /* ------------------------------------
     Delete comment
  ------------------------------------ */
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const updated = await deleteComment(postId, commentId);
      setPosts(
        posts.map((p) =>
          p._id === postId ? updated : p
        )
      );
    } catch (err) {
      console.error("Delete comment error:", err);
      alert("Failed to delete comment");
    }
  };

  /* ------------------------------------
     Delete post
  ------------------------------------ */
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Failed to delete post");
    }
  };

  /* ------------------------------------
     Edit post
  ------------------------------------ */
  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleSaveEdit = async (data) => {
    try {
      const updated = await editPost(editingPost._id, data);
      setPosts(
        posts.map((p) =>
          p._id === editingPost._id ? updated : p
        )
      );
      setEditingPost(null);
    } catch (err) {
      console.error("Edit post error:", err);
      alert(err?.response?.data?.message || "Failed to update post");
    }
  };

  /* ------------------------------------
     Loading state
  ------------------------------------ */
  if (loading) {
    return (
      <p className="mt-10 text-center text-slate-500">
        Loading feed...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      
      {/* Create post */}
      <CreatePost onPostCreated={loadFeed} />

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            No posts yet. Start the conversation 👋
          </p>
        </div>
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
  );
};

export default Feed;
