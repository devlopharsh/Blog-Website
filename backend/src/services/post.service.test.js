const Post = require("../models/post.model");
const postService = require("./post.service");

describe("post.service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a post with parsed tags", async () => {
    const createdPost = { _id: "post-1" };
    const createSpy = vi.spyOn(Post, "create").mockResolvedValue(createdPost);

    const result = await postService.createPost({
      title: "A post",
      tags: "react, nextjs , testing",
    });

    expect(createSpy).toHaveBeenCalledWith({
      title: "A post",
      tags: ["react", "nextjs", "testing"],
    });
    expect(result).toBe(createdPost);
  });

  it("builds the post query with search, pagination, and sorting", async () => {
    const sort = vi.fn().mockResolvedValue([{ _id: "post-1" }]);
    const limit = vi.fn(() => ({ sort }));
    const skip = vi.fn(() => ({ limit }));
    const findSpy = vi.spyOn(Post, "find").mockReturnValue({ skip });
    const countSpy = vi.spyOn(Post, "countDocuments").mockResolvedValue(11);

    const result = await postService.getPosts({
      page: 2,
      limit: 5,
      search: "react",
      author: "Harsh",
      category: "Frontend",
    });

    expect(findSpy).toHaveBeenCalledWith({
      title: { $regex: "react", $options: "i" },
      author: "Harsh",
      category: "Frontend",
    });
    expect(skip).toHaveBeenCalledWith(5);
    expect(limit).toHaveBeenCalledWith(5);
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(countSpy).toHaveBeenCalledWith({
      title: { $regex: "react", $options: "i" },
      author: "Harsh",
      category: "Frontend",
    });
    expect(result).toEqual({
      posts: [{ _id: "post-1" }],
      total: 11,
      page: 2,
      totalPages: 3,
    });
  });
});
