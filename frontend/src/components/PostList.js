import { useAuth } from "../hooks/useAuth";

const Postlist = ({ posts }) => {
  const { user } = useAuth();
  console.log(user._id);

  const handleClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="post-list">
      {posts &&
        posts.map((post) => (
          <div className="post-element" key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p>Likes: {post.likes.length}</p>
            <button onClick={handleClick}>
              {post.likes.includes(user._id) ? "Dislike" : "Like"}
            </button>
          </div>
        ))}
    </div>
  );
};

export default Postlist;
