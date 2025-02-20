import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const Comments = ({ post_id }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommentsFromPost = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/post/${post_id}/comments`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch comments");

        const json = await res.json();
        setComments(json);
      } catch (err) {
        setError(err.message);
      }
    };

    if (user) fetchCommentsFromPost();
  }, [user, post_id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/comment/on-post/${post_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ body: newComment }),
        }
      );

      if (!res.ok) throw new Error("Failed to add comment");

      const newAddedComment = await res.json();

      const updatedComment = {
        ...newAddedComment,
        body: newComment,
        commentBy: { _id: user._id, name: user.name, username: user.username },
      };

      setComments([...comments, updatedComment]);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>

      {error && <p className="error">{error}</p>}

      {comments.map((comment, index) => (
        <div key={comment._id || index} className="comment">
          <p>
            <strong>
              {comment.commentBy?.name ||
                comment.commentBy?.username ||
                "Unknown"}
              :
            </strong>{" "}
            {comment.body}
          </p>
        </div>
      ))}

      {user && (
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit">Post</button>
        </form>
      )}
    </div>
  );
};

export default Comments;
