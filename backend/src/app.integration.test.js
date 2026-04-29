const request = require("supertest");

const app = require("./app");
const authService = require("./services/auth.service");
const postService = require("./services/post.service");

describe("app integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRE = "1h";
  });

  it("returns paginated posts from GET /api/posts", async () => {
    vi.spyOn(postService, "getPosts").mockResolvedValue({
      posts: [{ _id: "post-1", title: "React Patterns" }],
      total: 1,
      page: 1,
      totalPages: 1,
    });

    const response = await request(app)
      .get("/api/posts")
      .query({ page: 1, limit: 10, search: "react" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      posts: [{ _id: "post-1", title: "React Patterns" }],
      total: 1,
      page: 1,
      totalPages: 1,
    });
  });

  it("returns health status from GET /api/health", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("ok");
    expect(response.body.uptime).toEqual(expect.any(Number));
    expect(response.body.timestamp).toEqual(expect.any(String));
  });

  it("rejects invalid post payloads on POST /api/posts", async () => {
    const response = await request(app).post("/api/posts").send({
      title: "No",
      shortDescription: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("length");
  });

  it("returns a JWT from POST /api/auth/login", async () => {
    vi.spyOn(authService, "login").mockResolvedValue({
      _id: "user-1",
      email: "author@example.com",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "author@example.com",
      password: "secret123",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toEqual(expect.any(String));
  });
});
