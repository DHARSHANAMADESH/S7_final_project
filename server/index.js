import { app } from './app.js';
import { connectMongoDB } from './db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`🚀 AI Recommendation Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Endpoints: /api/recommendations, /api/student, /api/companies, /api/auth`);
  });
}

startServer();
