import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UserCard = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!profile) return;

    const isFollowed = profile.followers.includes(user._id);
    const endpoint = isFollowed
      ? `http://localhost:4000/api/user/unfollow/${profile.username}`
      : `http://localhost:4000/api/user/follow/${profile.username}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update follow status");
      }

      setProfile((prevProfile) => ({
        ...prevProfile,
        followers: isFollowed
          ? prevProfile.followers.filter((id) => id !== user._id)
          : [...prevProfile.followers, user._id],
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/user/${username}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          throw new Error("User not found");
        }

        const data = await res.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [username, user]);

  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="user-card">
      <h2>{profile.name}</h2>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <span>
        Followers: {profile.followers.length} Followings:
        {profile.followings.length}
      </span>
      <br></br>
      <button onClick={handleClick}>
        {profile.followers.includes(user._id) ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserCard;
