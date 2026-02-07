import Button from "../ui/Button";
import Avatar from "../ui/Avatar";

const ProfileHeader = ({
  profile,
  isOwnProfile,
  isFollowing,
  onFollow,
  onEdit,
  postCount = 0
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      
      <div className="flex items-start gap-4">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <Avatar
            name={profile.username}
            src={profile.profilePic || null}
            size="lg"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#564172]">
                {profile.username}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {profile.bio || "No bio yet"}
              </p>

              <div className="mt-3 flex gap-4 text-sm">
                <span>
                  <strong>{postCount}</strong> {postCount === 1 ? 'post' : 'posts'}
                </span>
                <span>
                  <strong>{profile.followers?.length || 0}</strong> {profile.followers?.length === 1 ? 'follower' : 'followers'}
                </span>
                <span>
                  <strong>{profile.following?.length || 0}</strong> following
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                onEdit && (
                  <Button
                    variant="primary"
                    onClick={onEdit}
                  >
                    Edit Profile
                  </Button>
                )
              ) : (
                <Button
                  variant={isFollowing ? "secondary" : "primary"}
                  onClick={onFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
