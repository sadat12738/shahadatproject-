const axios = require("axios");
const fs = require("fs");
const path = require("path");

const links = [
 "https://files.catbox.moe/n8bj4l.mp3",
 "https://files.catbox.moe/dgw3a4.mp3",
 "https://files.catbox.moe/vghhh5.mp3",
 "https://files.catbox.moe/nt2ggy.mp3",
 "https://files.catbox.moe/wnep5y.mp3"
];

const triggers = ["💃🏾", "👯", "🎤", "🎙️", "🕺🏾", "🎺"];

module.exports.config = {
 name: "💃🏾",
 version: "2.0.0",
 hasPermssion: 0,
 credits: "𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁 | ᵁᴸᴸ⁴ˢᴴ",
 description: "auto reply with smart media",
 commandCategory: "noprefix",
 usages: triggers.join(", "),
 cooldowns: 5,
 dependencies: {
 "axios": "",
 "fs-extra": ""
 }
};

module.exports.handleEvent = async ({ api, event, Threads }) => {
 const content = event.body || '';
 const body = content.toLowerCase();

 if (triggers.some(emoji => body.startsWith(emoji))) {
 const rahad = [
 "╭•হাসবি না পাপির দল 🙂╯",
 "╭•হাসবি না পাপির দল 👅•╯"
 ];
 const rahad2 = rahad[Math.floor(Math.random() * rahad.length)];

 const fileUrl = links[Math.floor(Math.random() * links.length)];
 const fileExt = path.extname(fileUrl);
 const filePath = path.join(__dirname, "cache", `file${fileExt}`);

 try {
 const response = await axios({
 method: "GET",
 url: fileUrl,
 responseType: "stream"
 });

 const writer = fs.createWriteStream(filePath);
 response.data.pipe(writer);

 writer.on("finish", () => {
 api.sendMessage({
 body: rahad2,
 attachment: fs.createReadStream(filePath)
 }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
 });

 writer.on("error", (err) => {
 console.error("File write error:", err);
 api.sendMessage("❌ ফাইল পাঠাতে সমস্যা হয়েছে!", event.threadID, event.messageID);
 });

 } catch (error) {
 console.error("Download error:", error);
 api.sendMessage("❌ মিডিয়া ডাউনলোড ব্যর্থ!", event.threadID, event.messageID);
 }
 }
};

module.exports.languages = {
 "en": {
 "on": "on",
 "off": "off",
 "successText": "success!",
 }
};

module.exports.run = async ({ api, event, Threads, getText }) => {
 const { threadID, messageID } = event;
 let data = (await Threads.getData(threadID)).data;
 if (typeof data["💃🏾"] === "undefined" || data["💃🏾"]) data["💃🏾"] = false;
 else data["💃🏾"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["💃🏾"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};