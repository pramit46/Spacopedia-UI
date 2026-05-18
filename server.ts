import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { BACKEND_TARGETS } from "./src/apiConfig";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- WEEKLY-STATUS:: GENERIC PROXY HANDLER FOR VERSIONED ROUTES ---
  // This allows /api/v1/weekly-status, /api/v2/weekly-status, etc.
  app.post("/api/:version/weekly-status", async (req, res) => {
    const { version } = req.params;
    try {
      const { project_id, accepts = "application/json" } = req.body;
      
      if (!project_id) {
        return res.status(400).json({ status: "error", message: "Missing project_id in request body" });
      }
      
      const targetBase = BACKEND_TARGETS.WEEKLY_STATUS;
      
      console.log(`[Proxy ${version}] Tunneling request to: ${targetBase}`);
      console.log(`[Proxy ${version}] Payload (Body):`, { project_id, projectId: project_id, id: project_id, accepts });
      console.log(`[Proxy ${version}] Params (Query):`, { project_id, accepts });
      
      // Use axios config to safely pass parameters to the external backend.
      // We send data in body to accommodate varying backend implementations.
      // We strictly use 'project_id' as required by the external target, but provide fallout keys for robustness.
      const response = await axios({
        method: 'POST',
        url: targetBase,
        data: { 
          project_id: project_id, 
          projectId: project_id, // CamelCase fallback
          id: project_id,         // generic ID fallback
          accepts 
        },
        params: { project_id: project_id, accepts },
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'AI-Studio-Applet-Proxy'
        },
        timeout: 25000 
      });

      console.log(`[Proxy ${version}] Success: Remote returned ${Array.isArray(response.data) ? response.data.length : 'object'}`);
      res.json(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data;
      
      console.error(`[Proxy ${version}] Error ${status}:`, error.message);
      if (errorData) console.error(`[Proxy ${version}] Remote Error:`, JSON.stringify(errorData));
      
      res.status(status).json({ 
        status: "error", 
        message: "External API Integration Failure",
        details: error.message,
        errorData: errorData
      });
    }
  });

  // Other v1 Legacy Endpoints or Versioned Endpoints
  const apiRouter = express.Router();

  apiRouter.get("/messages", (req, res) => {
    res.json({ status: "success", data: [] });
  });

  apiRouter.post("/messages/star", (req, res) => {
    const { logId, commentId, starred } = req.body;
    res.json({ status: "success", starred });
  });

  apiRouter.post("/quotation/save", (req, res) => {
    try {
      const { items } = req.body;
      console.log(`[API Proxy] Saving quotation: ${items?.length || 0} items`);
      res.json({ status: "success", timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to save quotation" });
    }
  });

  // Mount routers for different versions
  app.use("/api/v1", apiRouter);
  // app.use("/api/v2", v2Router); // Example for future versions

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
