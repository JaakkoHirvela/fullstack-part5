import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>create new</h2>
      <div>
        title: <input type="text" value={newBlog.title} name="title" onChange={handleBlogChange} />
      </div>
      <div>
        author: <input type="text" value={newBlog.author} name="author" onChange={handleBlogChange} />
      </div>
      <div>
        url: <input type="text" value={newBlog.url} name="url" onChange={handleBlogChange} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
