import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PostFormPage } from "@/components/posts/post-form-page";
import { mockRouter } from "@/test/setup";
import { toast } from "sonner";

const mockCreatePost = vi.fn();
const mockGetPost = vi.fn();
const mockUpdatePost = vi.fn();
const mockGetToken = vi.fn();
const mockGetStoredUser = vi.fn();

vi.mock("@/lib/api", () => ({
  createPost: (...args: unknown[]) => mockCreatePost(...args),
  getPost: (...args: unknown[]) => mockGetPost(...args),
  updatePost: (...args: unknown[]) => mockUpdatePost(...args),
}));

vi.mock("@/lib/auth", () => ({
  getToken: () => mockGetToken(),
  getStoredUser: () => mockGetStoredUser(),
  isLoggedIn: () => true,
  clearAuth: vi.fn(),
}));

const existingPost = {
  _id: "post-1",
  title: "Existing title",
  email: "author@example.com",
  shortDescription: "Existing summary",
  content: "Existing content body",
  author: "Harsh",
  category: "Frontend",
  tags: ["react", "testing"],
  imageUrl: "https://example.com/post.png",
  status: "on" as const,
  createdAt: "2026-04-20T00:00:00.000Z",
  updatedAt: "2026-04-20T00:00:00.000Z",
};

describe("PostFormPage integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter.push.mockReset();
    mockRouter.refresh.mockReset();
    mockRouter.replace.mockReset();
    mockGetToken.mockReturnValue("token");
    mockGetStoredUser.mockReturnValue({ email: "author@example.com" });
    mockGetPost.mockResolvedValue(existingPost);
    mockCreatePost.mockResolvedValue(existingPost);
    mockUpdatePost.mockResolvedValue(existingPost);
  });

  it("loads an existing post in edit mode", async () => {
    render(<PostFormPage mode="edit" postId="post-1" />);

    expect(mockGetPost).toHaveBeenCalledWith("post-1");

    expect(await screen.findByDisplayValue("Existing title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing summary")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com/post.png")).toBeInTheDocument();
  });

  it("submits the create flow and redirects back to blogs", async () => {
    const user = userEvent.setup();

    render(<PostFormPage mode="create" />);

    await user.type(screen.getByLabelText("Title"), "Integration testing post");
    await user.type(
      screen.getByLabelText("Short Description"),
      "A concise description for the integrated form flow.",
    );
    await user.type(screen.getByLabelText("Content"), "Full content for the test post.");
    await user.type(screen.getByLabelText("Author"), "Harsh");
    await user.type(screen.getByLabelText("Category"), "Frontend");
    await user.type(
      screen.getByPlaceholderText("react, design systems, nextjs"),
      "react, vitest",
    );
    await user.type(
      screen.getByLabelText("Image URL"),
      "https://example.com/integration.png",
    );

    await user.click(screen.getByRole("button", { name: "Create Post" }));

    await waitFor(() =>
      expect(mockCreatePost).toHaveBeenCalledWith({
        title: "Integration testing post",
        shortDescription: "A concise description for the integrated form flow.",
        content: "Full content for the test post.",
        author: "Harsh",
        category: "Frontend",
        tags: "react, vitest",
        imageUrl: "https://example.com/integration.png",
        status: "on",
        email: "author@example.com",
      }),
    );

    expect(toast.success).toHaveBeenCalledWith("Post created successfully.");
    expect(mockRouter.push).toHaveBeenCalledWith("/blogs");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });
});
