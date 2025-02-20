import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const { logout } = useLogout();

  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const { user } = useAuth();

  const searchUser = async () => {
    if (!user || !username) return;

    try {
      const res = await fetch(`http://localhost:4000/api/user/${username}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        throw new Error("User not found");
      }

      navigate(`/user/${username}`);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    const navwrap = document.querySelector(".nav-wrapper");
    !user
      ? navwrap.classList.add("space-between")
      : navwrap.classList.remove("space-between");
  }, [user]);

  const handleClick = (e) => {
    logout();
  };
  return (
    <header>
      <div className="nav-wrapper">
        <Link to="/">
          <h2>Postly</h2>
        </Link>

        {user && (
          <div className="div-search">
            <input
              type="text"
              placeholder="Search for other blogers"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="searchbar"
            />
            <span>
              <button onClick={searchUser}>Search</button>
            </span>
          </div>
        )}

        <nav>
          <ul>
            {user && (
              <div>
                <Link to="/">
                  <li>Home</li>
                </Link>
                <Link to="/create">
                  <li>Add New Post</li>
                </Link>
                <Link to={`/${user.username}`}>
                  <li>{`${user.username}`}</li>
                </Link>
              </div>
            )}

            {user && (
              <div>
                <button onClick={handleClick}>Logout</button>
              </div>
            )}

            {!user && (
              <div>
                <Link to="/login">
                  <li>Login</li>
                </Link>

                <Link to="/signup">
                  <li>Signup</li>
                </Link>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
