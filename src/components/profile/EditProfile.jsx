import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";

const EditProfile = ({ profile, onSave, onCancel }) => {
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(profile?.profilePic || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (preview && preview !== profile?.profilePic) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, profile?.profilePic]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview && preview !== profile?.profilePic) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);
    setProfilePic(file);
    setPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave({
        username: username.trim(),
        bio: bio.trim(),
        profilePic: profilePic,
      });
    } catch (err) {
      console.error("Update profile error:", err);
      const errorMessage = err?.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile Picture */}
      <div className="flex items-center gap-4">
        <Avatar
          name={username || profile?.username}
          src={preview || null}
          size="lg"
        />
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
              Change Photo
            </span>
          </label>
          <p className="text-xs text-slate-500 mt-1">
            JPG, PNG or GIF. Max size 5MB
          </p>
        </div>
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Username *
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value.toLowerCase());
            setError(null);
          }}
          placeholder="username"
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
                     outline-none transition
                     focus:border-[#564172] focus:ring-2 focus:ring-[#564172]/20"
          disabled={loading}
          required
        />
        <p className="text-xs text-slate-500 mt-1">
          Username must be unique
        </p>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                     outline-none transition resize-none
                     focus:border-[#564172] focus:ring-2 focus:ring-[#564172]/20"
          disabled={loading}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

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
          disabled={loading || !username.trim()}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditProfile;
