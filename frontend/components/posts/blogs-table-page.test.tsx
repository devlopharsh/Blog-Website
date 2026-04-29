import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BlogsTablePage } from "@/components/posts/blogs-table-page";
import { toast } from "sonner";

const mockGetPosts = vi.fn();
const mockDeletePost = vi.fn();
const mockExportCsv = vi.fn();
const mockIsLoggedIn = vi.fn();

vi.mock("@/lib/api", () => ({
  getPosts: (...args: unknown[]) => mockGetPosts(...args),
  deletePost: (...args: unknown[]) => mockDeletePost(...args),
  exportCSV: (...args: unknown[]) => mockExportCsv(...args),
}));

vi.mock("@/lib/auth", () => ({
  isLoggedIn: () => mockIsLoggedIn(),
  getStoredUser: () => null,
  clearAuth: vi.fn(),
}));

const postsResponse = {
  posts: [
    {
      _id: "post-1",
      title: "React Patterns",
      email: "author@example.com",
      shortDescription: "Patterns for maintainable React code",
      content: "Detailed content for the first post",
      author: "Harsh",
      category: "Frontend",
      tags: ["react", "patterns"],
      status: "on" as const,
      createdAt: "2026-04-20T00:00:00.000Z",
      updatedAt: "2026-04-20T00:00:00.000Z",
    },
  ],
  total: 1,
  page: 1,
  totalPages: 1,
};

describe("BlogsTablePage", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    mockGetPosts.mockResolvedValue(postsResponse);
    mockDeletePost.mockResolvedValue(undefined);
    mockExportCsv.mockResolvedValue(new Blob(["csv"]));
    mockIsLoggedIn.mockReturnValue(false);
  });

  it("loads posts and shows login-gated actions for guests", async () => {
    render(<BlogsTablePage />);

    expect(mockGetPosts).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: undefined,
    });

    expect(await screen.findByText("React Patterns")).toBeInTheDocument();

    const row = screen.getByText("React Patterns").closest("tr");
    expect(row).not.toBeNull();

    fireEvent.click(within(row as HTMLTableRowElement).getByRole("button", { name: /edit/i }));

    expect(toast.message).toHaveBeenCalledWith("Please login to access");
  });

  it("requests filtered posts after the search debounce", async () => {
    render(<BlogsTablePage />);
    await screen.findByText("React Patterns");

    fireEvent.change(screen.getByPlaceholderText("Search by title"), {
      target: { value: "react" },
    });

    await waitFor(
      () =>
        expect(mockGetPosts).toHaveBeenLastCalledWith({
          page: 1,
          limit: 10,
          search: "react",
        }),
      { timeout: 2000 },
    );
  });
});
