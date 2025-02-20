import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuth } from "../hooks/useAuth";
const NavBar = () => {
  const { logout } = useLogout();

  const { user } = useAuth();
  const handleClick = (e) => {
    logout();
  };
  return (
    <header>
      <div className="nav-wrapper">
        <Link to="/">
          <h2>Postly</h2>
        </Link>

        <input
          type="text"
          placeholder="Search for other blogers"
          className="searchbar"
        />

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
                  <li>Profile</li>
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
