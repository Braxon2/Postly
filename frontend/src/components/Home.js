import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { usePostContext } from "../hooks/usePostContext";
import Postlist from "./PostList";
const Home = () => {
  const { posts, dispatch } = usePostContext();

  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("http://localhost:4000/api/post/followings", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await res.json();

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
      <h2>All Posts</h2>
      <Postlist posts={posts} />
    </div>
  );
};

export default Home;
