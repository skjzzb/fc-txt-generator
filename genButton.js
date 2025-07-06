// generateButtonList.js
const fs = require("fs");
const path = require("path");

const baseFolder = path.join(__dirname, "public/assets");
const platforms = ["ps", "xbox","icons"];
const allButtons = [];
const sanitizeId = (str) =>
  str.toLowerCase().replace(/[^a-z0-9-_]/g, '-'); // replaces all invalid characters

platforms.forEach((platform) => {
  const folderPath = path.join(baseFolder, platform);
  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    if (file.endsWith(".svg") || file.endsWith(".png")) {
      allButtons.push({
        // id: file.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
        id: file.replace(/\.[^/.]+$/, ""), // remove extension
        name: file,
        src: `/assets/${platform}/${file}`,
        platform: platform,
      });
    }
  });
});

fs.writeFileSync("./src/buttonData2.json", JSON.stringify(allButtons, null, 2));
console.log("✅ buttonData.json generated.");
