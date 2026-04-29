require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { startSelfPing } = require('./src/utils/self-ping');

const PORT = process.env.PORT || 5000;

// DB Connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  const serverUrl =
    process.env.SELF_PING_URL || `http://localhost:${PORT}/api/health`;

  startSelfPing({
    enabled: process.env.ENABLE_SELF_PING === 'true',
    url: serverUrl,
    intervalMs: process.env.SELF_PING_INTERVAL_MS,
  });
});
