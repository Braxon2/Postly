import NavBar from "./components/Navbar";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./components/Home";
import BlogForm from "./components/CreatePostForm";
import UserProfile from "./components/UserProfile";
import { useAuth } from "./hooks/useAuth";
import NotFoundPage from "./components/NotFoundPage";
import UserCard from "./components/UserCard";
import PostDetails from "./components/PostDetails";

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className="pages">
          <Routes>
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/create"
              element={user ? <BlogForm /> : <Navigate to="/login" />}
            />

            {user && (
              <Route
                path={`/${user.username}`}
                element={user ? <UserProfile /> : <Navigate to="/login" />}
              />
            )}
            <Route
              path="/user/:username"
              element={user ? <UserCard /> : <Navigate to="/login" />}
            />
            <Route
              path="/post/:id"
              element={user ? <PostDetails /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
