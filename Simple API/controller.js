const { readItems, writeItems } = require("./storage");

//creating an empty string for storing the req body
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        const body = JSON.parse(data);
        resolve(body);
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
};

//creating a send function to prevent repetition in the return statement
const send = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: status < 400, data: payload }));
};

//function for creating new item
const createItem = async (req, res) => {
  try {
    const body = await parseBody(req);
    const { name, price, size } = body;

    //A middleware for checking the data sent if it conforms to the shema
    if (!name || !price || !["s", "m", "l"].includes(size)) {
      return send(res, 400, "Invalid input");
    }

    //adding the new item to the items.json file
    const items = await readItems();
    const newItem = {
      id: Date.now().toString(),
      name,
      price,
      size,
    };
    items.push(newItem);
    await writeItems(items);
    send(res, 201, newItem);
  } catch (err) {
    send(res, 500, err.message);
  }
};

//function for listing all items
const getAllItems = async (req, res) => {
  try {
    const items = await readItems();
    send(res, 200, items);
  } catch (err) {
    send(res, 500, err.message);
  }
};

//getting an item using the id value
const getItem = async (req, res, id) => {
  try {
    const items = await readItems();
    const item = items.find((i) => i.id === id);
    if (!item) return send(res, 404, "Item not found");
    send(res, 200, item);
  } catch (err) {
    send(res, 500, err.message);
  }
};

//updating an item by using the id value to get the index of the item in items.json file array
async function updateItem(req, res, id) {
  try {
    const body = await parseBody(req);
    const items = await readItems();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return send(res, 404, "Item not found");

    const item = items[index];
    items[index] = { ...item, ...body };
    await writeItems(items);
    send(res, 200, items[index]);
  } catch (err) {
    send(res, 500, err.message);
  }
}

//delecting an item by using the id value to get the index of the item in items.json file array
async function deleteItem(req, res, id) {
  try {
    const items = await readItems();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return send(res, 404, "Item not found");
    const deletedItem = items.splice(index, 1)[0];
    await writeItems(items);
    send(res, 200, items);
  } catch (err) {
    send(res, 500, err.message);
  }
}

module.exports = {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,
};
