const fs = require("fs").promises;
const path = require("path");

//accessing the items.json file
const FILE = path.join(__dirname, "items.json");

//read data in items.json
const readItems = async () => {
  try {
    const data = await fs.readFile(FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

//update data in items.json
const writeItems = async (items) => {
  await fs.writeFile(FILE, JSON.stringify(items, null, 2));
};

module.exports = { readItems, writeItems };
