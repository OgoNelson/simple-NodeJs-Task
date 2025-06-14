const { parse } = require("url");
const {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,
} = require("./controller");

const routeHandler = (req, res) => {
  const { pathname, query } = parse(req.url, true);
  const method = req.method;

  //path to create new item
  if (pathname === "/items" && method === "POST") return createItem(req, res);

  //path to list all items
  if (pathname === "/items" && method === "GET") return getAllItems(req, res);

  //performing an action on a specific item
  const idMatch = pathname.match(/^\/items\/([\w-]+)$/);
  if (idMatch) {
    const id = idMatch[1];
    if (method === "GET") return getItem(req, res, id);
    if (method === "PUT") return updateItem(req, res, id);
    if (method === "DELETE") return deleteItem(req, res, id);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: false, message: "Route not found" }));
};

module.exports = { routeHandler };
