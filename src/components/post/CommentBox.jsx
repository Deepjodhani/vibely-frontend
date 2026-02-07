import { useState } from "react";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const CommentBox = ({ post, onComment, onDeleteComment }) => {
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- Submit Comment ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() || submitting || !user) return;

    try {
      setSubmitting(true);
      setError(null);
      await onComment(post._id, text);
      setText("");
    } catch (err) {
      console.error("Comment submission error:", err);
      const errorMessage = err?.response?.data?.message || "Failed to send comment. Try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">

      {/* ---------------- Existing Comments ---------------- */}
      {post?.comments?.length > 0 && (
        <div className="space-y-1">
          {post.comments.map((c, index) => {
            const isCommentOwner = user && typeof c.user === "object" && c.user._id === user._id;
            const isPostOwner = user && post.user._id === user._id;
            const canDelete = isCommentOwner || isPostOwner;

            return (
              <div
                key={c._id || index}
                className="flex items-start justify-between gap-2 group"
              >
                <p className="text-sm text-slate-700 flex-1">
                  <span className="font-medium text-slate-800">
                    {typeof c.user === "object" ? c.user.username : "User"}:
                  </span>{" "}
                  {c.text}
                </p>
                {canDelete && onDeleteComment && (
                  <button
                    onClick={() => onDeleteComment(post._id, c._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                    title="Delete comment"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- Add Comment ---------------- */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            disabled={submitting}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm
                       outline-none transition
                       focus:border-[#564172] focus:ring-2 focus:ring-[#564172]/20
                       disabled:bg-slate-100"
          />

          <Button
            type="submit"
            size="sm"
            disabled={!text.trim() || submitting}
          >
            {submitting ? "Sending…" : "Send"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-slate-400">
          Login to comment
        </p>
      )}

      {/* ---------------- Error ---------------- */}
      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default CommentBox;
