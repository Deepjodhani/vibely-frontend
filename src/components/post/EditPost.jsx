import { useState, useEffect } from "react";
import Button from "../ui/Button";

const EditPost = ({ post, onSave, onCancel }) => {
  const [content, setContent] = useState(post?.content || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post?.image || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview && preview !== post?.image) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, post?.image]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview && preview !== post?.image) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImage(file);
    setPreview(previewUrl);
  };

  const removeImage = () => {
    if (preview && preview !== post?.image) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const data = {
        content: content.trim(),
      };
      
      // If image was removed (had image before, no preview now)
      if (post?.image && !preview) {
        data.removeImage = true;
      } else if (image) {
        data.image = image;
      }
      
      await onSave(data);
    } catch (err) {
      console.error("Edit post error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                     outline-none transition resize-none
                     focus:border-[#564172] focus:ring-2 focus:ring-[#564172]/20"
          disabled={loading}
        />
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <div className="overflow-hidden rounded-xl border bg-black">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-[400px] object-contain"
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full
                       w-8 h-8 flex items-center justify-center hover:bg-red-600
                       transition-colors"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={loading}
          />
          <span className="inline-block px-4 py-2 text-sm border border-slate-200
                          rounded-xl cursor-pointer hover:bg-slate-50 transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed">
            {preview ? "Change Image" : "Add Image"}
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || (!content.trim() && !preview)}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditPost;
