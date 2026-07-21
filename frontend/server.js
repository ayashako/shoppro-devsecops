const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 8080);
const publicDirectory = path.join(__dirname, "public");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function safeFilePath(urlPath) {
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(publicDirectory, normalizedPath);

  if (!fullPath.startsWith(publicDirectory)) {
    return null;
  }

  return fullPath;
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const filePath = safeFilePath(requestUrl.pathname);

  if (!filePath) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy":"default-src 'self'; connect-src 'self' http://100.24.70.171:3001 http://100.24.70.171:3002"
    });
    response.end(data);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`ShopPro frontend listening on port ${port}`);
});
