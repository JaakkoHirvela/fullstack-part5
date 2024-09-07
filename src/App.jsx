import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import NotificationBar from "./components/NotificationBar";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

const NotificationType = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
});

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: NotificationType.SUCCESS });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  const setSuccessNotification = (message) => {
    setNotification({ message, type: NotificationType.SUCCESS });
    setTimeout(() => {
      setNotification({ message: "", type: NotificationType.SUCCESS });
    }, 5000);
  };
  const setErrorNotification = (message) => {
    setNotification({ message, type: NotificationType.ERROR });
    setTimeout(() => {
      setNotification({ message: "", type: NotificationType.ERROR });
    }, 5000);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      setNotification({ message: "Loading blogs...", type: NotificationType.INFO });
      const blogs = await blogService.getAll();
      setSuccessNotification("Blogs loaded");
      setBlogs(blogs);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loginData = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(loginData));
      setSuccessNotification("Logged in successfully as " + loginData.name);
      setUser(loginData);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("error logging in:", error);
      setErrorNotification("Wrong username or password");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const createBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog, user.token);
      setBlogs(blogs.concat(response.data));
      setSuccessNotification(`A new blog ${newBlog.title} by ${newBlog.author} added`);
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      setErrorNotification("Failed to create blog: " + error.response.data.error);
    }
  };

  const addLikeToBlog = async (blog) => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 };
      const response = await blogService.update(updatedBlog, user.token);

      // Update the blog in the state.
      setBlogs(blogs.map((blog) => (blog.id === response.data.id ? { ...blog, likes: response.data.likes } : blog)));
      setSuccessNotification(`Blog ${updatedBlog.title} liked!`);
    } catch (error) {
      console.error("error liking blog:", error);
      setErrorNotification("Failed to like blog: " + error.response.data.error);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in</h2>
        <NotificationBar notification={notification} />
        <LoginForm onSubmit={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword} />
      </div>
    );
  }
  return (
    <div>
      <h2>blogs</h2>
      <NotificationBar notification={notification} />
      <div style={{ paddingBottom: "10px" }}>
        Logged in as {user.name}
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} handleLike={addLikeToBlog} />
      ))}
    </div>
  );
};

export default App;
