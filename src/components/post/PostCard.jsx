import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import CommentBox from "./CommentBox";

const PostCard = ({ post, onLike, onComment, onDeleteComment, onDeletePost, onEditPost }) => {
  const { user: loggedInUser } = useAuth();
  const postUser = post?.user || {};

  const isLiked =
    loggedInUser &&
    post?.likes?.includes(loggedInUser._id);

  const isPostOwner = loggedInUser && post?.user?._id === loggedInUser._id;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">

      {/* ================= User Header ================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <Avatar
          name={postUser.username || "User"}
          src={postUser.profilePic || null}
        />

          <div className="leading-tight">
            {postUser._id ? (
              <Link
                to={`/profile/${postUser._id}`}
                className="text-sm font-medium text-slate-800 hover:underline"
              >
                {postUser.username}
              </Link>
            ) : (
              <p className="text-sm font-medium text-slate-800">
                {postUser.username || "User"}
              </p>
            )}

            <span className="block text-xs text-slate-400">
              {post?.createdAt &&
                new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Edit/Delete buttons for post owner */}
        {isPostOwner && (
          <div className="flex items-center gap-2">
            {onEditPost && (
              <button
                onClick={() => onEditPost(post)}
                className="text-slate-500 hover:text-[#564172] transition-colors p-1"
                title="Edit post"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDeletePost && (
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this post?")) {
                    onDeletePost(post._id);
                  }
                }}
                className="text-slate-500 hover:text-red-500 transition-colors p-1"
                title="Delete post"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= Text ================= */}
      {post?.content?.trim() && (
        <p className="text-sm text-slate-700 whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* ================= Image ================= */}
      {post?.image && (
        <div className="overflow-hidden rounded-xl border bg-black">
          <img
            src={post.image}
            alt="post"
            className="w-full max-h-[500px] object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* ================= Actions ================= */}
      <div className="flex items-center gap-6 pt-1">

        {/* ❤️ Like Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike?.(post._id)}
          className={`flex items-center gap-1 ${
            isLiked ? "text-red-500" : "text-slate-600"
          }`}
        >
          <span className="text-lg">
            {isLiked ? "❤️" : "🤍"}
          </span>
          <span className="text-sm">
            {post?.likes?.length || 0}
          </span>
        </Button>

        {/* 💬 Comment Count */}
        <span className="text-sm text-slate-500">
          💬 {post?.comments?.length || 0}
        </span>
      </div>

      {/* ================= Comments ================= */}
      <CommentBox
        post={post}
        onComment={onComment}
        onDeleteComment={onDeleteComment}
      />
    </div>
  );
};

export default PostCard;
