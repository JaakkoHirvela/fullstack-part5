import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import { expect } from "vitest";

test("renders content", () => {
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
