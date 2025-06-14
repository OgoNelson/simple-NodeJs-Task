const http = require("http");
const { routeHandler } = require("./routes");

const PORT = 3000;

const server = http.createServer((req, res) => {
  routeHandler(req, res);
});

server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
