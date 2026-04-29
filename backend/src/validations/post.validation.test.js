const {
  createMultiplePostsSchema,
  createPostSchema,
  updatePostSchema,
} = require("./post.validation");

const validPost = {
  title: "React testing guide",
  email: "author@example.com",
  shortDescription: "A concise summary",
  content: "This content is long enough to pass validation.",
  author: "Harsh",
  category: "Frontend",
  tags: "react,testing",
  imageUrl: "https://example.com/image.png",
  status: "on",
};

describe("post validation schemas", () => {
  it("accepts a valid single post payload", () => {
    const { error, value } = createPostSchema.validate(validPost);

    expect(error).toBeUndefined();
    expect(value.title).toBe(validPost.title);
  });

  it("requires at least one post for bulk creation", () => {
    const { error } = createMultiplePostsSchema.validate([]);

    expect(error).toBeDefined();
  });

  it("requires email when updating a post", () => {
    const { error } = updatePostSchema.validate({
      title: "Updated title",
    });

    expect(error).toBeDefined();
    expect(error.details[0].message).toContain("email");
  });
});
