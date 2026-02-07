import { useEffect, useState } from "react";
import Button from "../ui/Button";
import api from "../../api/axios";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ------------------------------------
     Handle image select
  ------------------------------------ */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // clean previous preview
    if (preview) URL.revokeObjectURL(preview);

    const previewUrl = URL.createObjectURL(file);
    setImage(file);
    setPreview(previewUrl);
  };

  /* ------------------------------------
     Remove image
  ------------------------------------ */
  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  /* ------------------------------------
     Cleanup on unmount
  ------------------------------------ */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ------------------------------------
     Submit post
  ------------------------------------ */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;
  if (!content.trim() && !image) return;

  try {
    setLoading(true);

    const formData = new FormData();
    if (content.trim()) {
      formData.append("content", content.trim());
    }
    if (image) {
      formData.append("image", image);
    }

    await api.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setContent("");
    removeImage();

    if (onPostCreated) {
      await onPostCreated();
    }
  } catch (err) {
    console.error(err);
    alert("Failed to create post. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        
        {/* Text input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          disabled={loading}
          className="
            w-full resize-none rounded-xl border border-slate-200
            px-4 py-3 text-sm outline-none
            focus:border-[#564172] focus:ring-2 focus:ring-[#564172]/20
          "
        />

        {/* Image preview */}
        {preview && (
          <div className="relative overflow-hidden rounded-xl border">
            <img
              src={preview}
              alt="Post preview"
              className="max-h-60 w-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="
                absolute top-2 right-2
                rounded-full bg-black/60 px-2 py-1
                text-xs text-white hover:bg-black
              "
            >
              ✕
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <label
            className="
              cursor-pointer text-sm font-medium text-[#564172]
              hover:underline
            "
          >
            Add image
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={loading}
              onChange={handleImageChange}
            />
          </label>

          <Button
            type="submit"
            size="sm"
            disabled={loading || (!content.trim() && !image)}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
