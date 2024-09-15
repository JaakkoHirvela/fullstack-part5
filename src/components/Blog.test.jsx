import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect } from "vitest";

const testUser = {
  name: "Test User",
  username: "testuser",
  id: "12345",
};
const testBlog = {
  title: "This is the test blog",
  author: "Test Author",
  url: "http://test.url",
  likes: 0,
  user: testUser,
};

test("renders content, limited view", () => {
  const handleLike = () => {};
  const handleDelete = () => {};

  render(<Blog blog={testBlog} user={testUser} handleDelete={handleDelete} handleLike={handleLike} />);

  // Check that the blog title and author are rendered.
  screen.getByText("This is the test blog Test Author");

  // Check that the blog url is not displayed.
  const url = screen.getByText("http://test.url");
  const urlParentStyle = window.getComputedStyle(url.parentElement);

  // Check that the blog user name is not displayed.
  const userName = screen.getByText("Test User");
  const userNameParentStyle = window.getComputedStyle(userName.parentElement);

  // Check that the blog likes are not displayed.
  const likes = screen.getByText("likes 0");
  const likesParentStyle = window.getComputedStyle(likes.parentElement);

  expect(urlParentStyle.display).toBe("none");
  expect(userNameParentStyle.display).toBe("none");
  expect(likesParentStyle.display).toBe("none");
});

test("renders content, expanded view", async () => {
  // Setup the userEvent library.
  const user = userEvent.setup();

  const handleLike = () => {};
  const handleDelete = () => {};

  render(<Blog blog={testBlog} user={testUser} handleDelete={handleDelete} handleLike={handleLike} />);

  // Check that the blog title and author are rendered.
  screen.getByText("This is the test blog Test Author");

  // Click the view button to expand the blog.
  const button = screen.getByText("view");
  await user.click(button);

  // Check that the blog url is not displayed.
  const url = screen.getByText("http://test.url");
  const urlParentStyle = window.getComputedStyle(url.parentElement);

  // Check that the blog user name is not displayed.
  const userName = screen.getByText("Test User");
  const userNameParentStyle = window.getComputedStyle(userName.parentElement);

  // Check that the blog likes are not displayed.
  const likes = screen.getByText("likes 0");
  const likesParentStyle = window.getComputedStyle(likes.parentElement);

  expect(urlParentStyle.display).not.toBe("none");
  expect(userNameParentStyle.display).not.toBe("none");
  expect(likesParentStyle.display).not.toBe("none");
});

test("handleLike is called 2 times when clicked 2 times", async () => {
  // Setup the userEvent library.
  const user = userEvent.setup();

  const mockLike = vi.fn();
  const handleDelete = () => {};

  render(<Blog blog={testBlog} user={testUser} handleDelete={handleDelete} handleLike={mockLike} />);

  // Check that the blog title and author are rendered.
  screen.getByText("This is the test blog Test Author");

  // Click the view button to expand the blog.
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockLike).toHaveBeenCalledTimes(2);
});
