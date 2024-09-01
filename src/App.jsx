import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import NotificationBar from "./components/NotificationBar";
import LoginForm from "./components/LoginForm";

const NotificationType = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
});

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const [notification, setNotification] = useState({ message: "", type: NotificationType.SUCCESS });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

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
    console.log("logging in with", username, password);

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

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    try {
      const response = await blogService.create(newBlog, user.token);
      setBlogs(blogs.concat(response.data));
      setSuccessNotification(`A new blog ${newBlog.title} by ${newBlog.author} added`);
      setNewBlog({ title: "", author: "", url: "" });
    } catch (error) {
      setErrorNotification("Failed to create blog: " + error.response.data.error);
    }
  };

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
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
      <BlogForm onSubmit={handleCreateBlog} onChange={handleBlogChange} newBlog={newBlog} />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
