import { createServer } from "http";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    let filePath = req.url === "/" ? "/index.html" : req.url;
    filePath = join(__dirname, "dist", filePath);

    if (!existsSync(filePath)) {
      // For SPA routing, serve index.html for all routes
      filePath = join(__dirname, "dist", "index.html");
    }

    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";

    const content = await readFile(filePath);

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File not found, serve index.html for SPA routing
      try {
        const content = await readFile(join(__dirname, "dist", "index.html"));
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      } catch (err) {
        res.writeHead(500);
        res.end("Server Error");
      }
    } else {
      res.writeHead(500);
      res.end("Server Error");
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
