const BlogForm = ({ onSubmit, onChange, newBlog }) => {
  return (
    <form onSubmit={onSubmit}>
      <h2>create new</h2>
      <div>
        title: <input type="text" value={newBlog.title} name="title" onChange={onChange} />
      </div>
      <div>
        author: <input type="text" value={newBlog.author} name="author" onChange={onChange} />
      </div>
      <div>
        url: <input type="text" value={newBlog.url} name="url" onChange={onChange} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
