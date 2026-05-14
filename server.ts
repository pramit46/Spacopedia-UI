import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  // This is a placeholder for the real-time messages API requested by the user
  app.get("/api/messages", (req, res) => {
    // In a real scenario with Firebase, this might fetch from Firestore
    // For now, it reflects the intent to have an endpoint for messages
    res.json({
      status: "success",
      message: "API ready for real-time message sync",
      data: [] // Filtered messages (e.g. new or starred) would go here
    });
  });

  app.post("/api/messages/star", (req, res) => {
    const { logId, commentId, starred } = req.body;
    // Logic to update star status in DB
    res.json({ status: "success", starred });
  });

  app.post("/api/quotation/save", (req, res) => {
    try {
      const { items } = req.body;
      console.log(`[API] Saving quotation delta: ${items?.length || 0} items at ${new Date().toISOString()}`);
      res.json({ status: "success", timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("[API] Error saving quotation:", error);
      res.status(500).json({ status: "error", message: "Failed to save quotation" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical: Server failed to start:", err);
  process.exit(1);
});
