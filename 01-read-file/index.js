import fs from "fs";
import path from "path";

// const readStream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf8");

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const readStream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf8");


readStream.on("data", (chunk) => {
    console.log(chunk);
})

readStream.on("error", (err) => {
    console.error(err);
})