const { DEFAULT_INTERVAL_MS, startSelfPing } = require("./self-ping");

describe("self-ping", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("does not start when disabled", () => {
    const timer = startSelfPing({
      enabled: false,
      url: "http://localhost:5000/api/health",
      logger: { log: vi.fn(), error: vi.fn() },
    });

    expect(timer).toBeNull();
  });

  it("starts an interval with the provided timing", () => {
    const setIntervalSpy = vi.spyOn(global, "setInterval").mockReturnValue(123);

    const timer = startSelfPing({
      enabled: true,
      url: "http://localhost:5000/api/health",
      intervalMs: 50000,
      logger: { log: vi.fn(), error: vi.fn() },
    });

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 50000);
    expect(timer).toBe(123);
  });

  it("falls back to the default interval for invalid input", () => {
    const setIntervalSpy = vi.spyOn(global, "setInterval").mockReturnValue(456);

    startSelfPing({
      enabled: true,
      url: "http://localhost:5000/api/health",
      intervalMs: 0,
      logger: { log: vi.fn(), error: vi.fn() },
    });

    expect(setIntervalSpy).toHaveBeenCalledWith(
      expect.any(Function),
      DEFAULT_INTERVAL_MS,
    );
  });
});
