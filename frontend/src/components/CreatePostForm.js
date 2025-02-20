import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { usePostContext } from "../hooks/usePostContext";
import { useNavigate } from "react-router-dom";

const BlogForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [error, setError] = useState("");

  const { user } = useAuth();

  const { dispatch } = usePostContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    try {
      const post = { title, body };
      const res = await fetch("http://localhost:4000/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(post),
      });

      const json = await res.json();
      if (!res.ok) {
        throw Error(json.error || "Failed to create blog");
      }
      console.log(json);

      if (res.ok) {
        setError("");
        dispatch({ type: "CREATE_POST", payload: json });
        navigate(`/${user.username}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create">
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Body:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type body"
          className="body"
        ></textarea>
        <button>Add recipe</button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};
export default BlogForm;
