import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = process.argv[2] || process.cwd();
const PORT = Number(process.argv[3] || 8899);
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".woff2": "font/woff2", ".png": "image/png", ".mp4": "video/mp4", ".svg": "image/svg+xml", ".json": "application/json" };

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let p = normalize(join(ROOT, url));
    if (!p.startsWith(normalize(ROOT))) { res.writeHead(403).end("forbidden"); return; }
    const s = await stat(p).catch(() => null);
    if (s && s.isDirectory()) p = join(p, "index.html");
    const buf = await readFile(p);
    res.writeHead(200, { "content-type": TYPES[extname(p).toLowerCase()] || "application/octet-stream", "content-length": buf.length, "cache-control": "no-store" });
    res.end(buf);
  } catch (e) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("not found: " + e.message);
  }
}).listen(PORT, "127.0.0.1", () => console.log("serving " + ROOT + " on http://127.0.0.1:" + PORT));
