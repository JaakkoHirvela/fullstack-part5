const BlogForm = ({ onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <h2>create new</h2>
      <div>
        title: <input type="text" name="title" onChange={onChange} />
      </div>
      <div>
        author: <input type="text" name="author" onChange={onChange} />
      </div>
      <div>
        url: <input type="text" name="url" onChange={onChange} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
