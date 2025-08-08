const fs = require("fs");
const path = require("path");
const axios = require("axios");

const folder = "./payloads"; // download and extract JSON here

fs.readdir(folder, async (err, files) => {
  for (const file of files) {
    const content = fs.readFileSync(path.join(folder, file), "utf8");
    const json = JSON.parse(content);
    
    if (json.type === "message") {
      await axios.post("http://localhost:3001/webhook", json);
      console.log("Inserted:", file);
    } else if (json.type === "status") {
      await axios.put("http://localhost:3001/webhook/status", {
        id: json.id,
        status: json.status
      });
      console.log("Updated status:", file);
    }
  }
});
