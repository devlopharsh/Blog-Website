const http = require("http");
const https = require("https");

const DEFAULT_INTERVAL_MS = 50_000;

function request(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https://") ? https : http;

    const req = client.get(url, (res) => {
      res.resume();
      resolve(res.statusCode || 0);
    });

    req.on("error", reject);
  });
}

function startSelfPing({
  enabled = false,
  url,
  intervalMs = DEFAULT_INTERVAL_MS,
  logger = console,
} = {}) {
  if (!enabled || !url) {
    return null;
  }

  const safeInterval = Number(intervalMs) > 0 ? Number(intervalMs) : DEFAULT_INTERVAL_MS;

  logger.log(`Self-ping enabled: ${url} every ${safeInterval}ms`);

  return setInterval(async () => {
    try {
      const statusCode = await request(url);
      logger.log(`Self-ping success: ${statusCode}`);
    } catch (error) {
      logger.error("Self-ping failed", error.message);
    }
  }, safeInterval);
}

module.exports = {
  DEFAULT_INTERVAL_MS,
  startSelfPing,
};
