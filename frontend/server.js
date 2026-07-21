const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 8080);
const publicDirectory = path.join(__dirname, "public");

const productServiceHost =
  process.env.PRODUCT_SERVICE_HOST || "product-service";

const productServicePort =
  Number(process.env.PRODUCT_SERVICE_PORT || 3001);

const orderServiceHost =
  process.env.ORDER_SERVICE_HOST || "order-service";

const orderServicePort =
  Number(process.env.ORDER_SERVICE_PORT || 3002);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function setSecurityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self'"
  );
}

function safeFilePath(urlPath) {
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;

  const normalizedPath = path
    .normalize(requestedPath)
    .replace(/^(\.\.[/\\])+/, "");

  const fullPath = path.join(publicDirectory, normalizedPath);

  if (!fullPath.startsWith(publicDirectory)) {
    return null;
  }

  return fullPath;
}

function proxyRequest(request, response, target) {
  const rewrittenPath =
    request.url.slice(target.prefix.length) || "/";

  const options = {
    hostname: target.host,
    port: target.port,
    path: rewrittenPath,
    method: request.method,
    headers: {
      ...request.headers,
      host: `${target.host}:${target.port}`
    }
  };

  const proxy = http.request(options, (proxyResponse) => {
    setSecurityHeaders(response);

    response.writeHead(
      proxyResponse.statusCode || 502,
      proxyResponse.headers
    );

    proxyResponse.pipe(response);
  });

  proxy.on("error", (error) => {
    console.error("Proxy error:", error.message);

    setSecurityHeaders(response);

    response.writeHead(502, {
      "Content-Type": "application/json; charset=utf-8"
    });

    response.end(
      JSON.stringify({
        error: "Backend service unavailable"
      })
    );
  });

  request.pipe(proxy);
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(
    request.url,
    `http://${request.headers.host}`
  );

  if (requestUrl.pathname === "/health") {
    setSecurityHeaders(response);

    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });

    response.end(
      JSON.stringify({
        status: "healthy",
        service: "frontend"
      })
    );

    return;
  }

  if (requestUrl.pathname.startsWith("/api/product")) {
    proxyRequest(request, response, {
      prefix: "/api/product",
      host: productServiceHost,
      port: productServicePort
    });

    return;
  }

  if (requestUrl.pathname.startsWith("/api/order")) {
    proxyRequest(request, response, {
      prefix: "/api/order",
      host: orderServiceHost,
      port: orderServicePort
    });

    return;
  }

  const filePath = safeFilePath(requestUrl.pathname);

  if (!filePath) {
    setSecurityHeaders(response);

    response.writeHead(400, {
      "Content-Type": "text/plain; charset=utf-8"
    });

    response.end("Bad request");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      setSecurityHeaders(response);

      response.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
      });

      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);

    setSecurityHeaders(response);

    response.writeHead(200, {
      "Content-Type":
        contentTypes[extension] ||
        "application/octet-stream"
    });

    response.end(data);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`ShopPro frontend listening on port ${port}`);
});
