import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { usePostContext } from "../hooks/usePostContext";
import { Link } from "react-router-dom";

const Postlist = ({ posts }) => {
  const { user } = useAuth();

  const { dispatch } = usePostContext();

  const [error, SetError] = useState("");

  const handleClick = (e, post) => {
    e.preventDefault();

    const fetchPost = async () => {
      const isLiked = post.likes.includes(user._id);
      const endpoint = isLiked
        ? `http://localhost:4000/api/post/dislike/${post._id}`
        : `http://localhost:4000/api/post/like/${post._id}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await res.json();

      if (res.ok) {
        dispatch({
          type: "UPDATE_MY_POSTS",
          payload: {
            ...post,
            likes: isLiked
              ? post.likes.filter((id) => id !== user._id)
              : [...post.likes, user._id],
          },
        });
      }
    };
    if (user) {
      fetchPost();
    }
  };

  const handleDelete = async (e, post) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:4000/api/post/${post._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await res.json();

    if (res.ok) {
      dispatch({
        type: "DELETE_POST",
        payload: json,
      });
    }
  };

  return (
    <div className="post-list">
      {posts &&
        posts.map((post) => (
          <div className="post-element" key={post._id}>
            <Link to={`/post/${post._id}`}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <p>Likes: {post.likes?.length}</p>
            </Link>
            <button onClick={(e) => handleClick(e, post)}>
              {post.likes?.includes(user._id) ? "dislike" : "like"}
            </button>
            {user._id === post.postedBy && (
              <button onClick={(e) => handleDelete(e, post)}>Delete</button>
            )}
            {error && <div>{error}</div>}
          </div>
        ))}
    </div>
  );
};

export default Postlist;
