const app = require("./app");

const port = Number(process.env.PORT || 3002);

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Order service listening on port ${port}`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
