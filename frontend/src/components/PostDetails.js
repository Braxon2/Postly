import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Comments from "./Comments";

const PostDetails = () => {
  const { id } = useParams();

  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/post/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPost();
  }, [id, user]);

  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <p>Likes: {post.likes?.length}</p>
      <Comments post_id={post._id} />
    </div>
  );
};

export default PostDetails;
