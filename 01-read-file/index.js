import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const readStream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf8");


readStream.on("data", (chunk) => {
    console.log(chunk);
})

readStream.on("error", (err) => {
    console.error(err);
})