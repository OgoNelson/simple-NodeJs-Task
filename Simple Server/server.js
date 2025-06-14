const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 8000;

const server = http.createServer((req, res) => {
//   Only allow access to /index.html
    if (req.url === "/index.html") {
      const filePath = path.join(__dirname, "index.html");
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end("<h1>500 Internal Server Error</h1>");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else if (req.url.endsWith(".html")) {
      // Any other .html file - return 404
      const filePath = path.join(__dirname, "404.html");
      fs.readFile(filePath, (err, data) => {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(data || "<h1>404 Page Not Found</h1>");
      });
    } else {
      // For non-html requests url
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("Forbidden");
    }
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
