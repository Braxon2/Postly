import { useAuth } from "../hooks/useAuth";
import { usePostContext } from "../hooks/usePostContext";
import { useEffect } from "react";
import Postlist from "./PostList";

const UserProfile = () => {
  const { user } = useAuth();

  const { posts, dispatch } = usePostContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("http://localhost:4000/api/post/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await res.json();

      console.log(json);

      if (res.ok) {
        dispatch({ type: "SET_MY_POSTS", payload: json });
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [dispatch, user]);

  return (
    <div className="blog-list">
      <h2>My Posts</h2>
      <Postlist posts={posts} />
    </div>
  );
};

export default UserProfile;
