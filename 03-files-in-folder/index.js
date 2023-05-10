import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/\\/g, '/');
const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, {withFileTypes: true}, (err, files) => {
    if (err) {
        console.error(`Error reading directory: ${err}`);
        return;
    } else {
        files.forEach((file) => {

            const dirPath = path.join(secretFolderPath, file.name);
            fs.stat(dirPath, (err, stats) => {
                if (err) {
                    console.error("Could not get stats for: " + file);
                    return;
                }
                if (stats.isFile()){
                    // const filePath = path.join(secretFolderPath, file.name);
                    const size = stats.size;
                    const extension = path.extname(file.name).replace('.', '');
                    const fileName = path.basename(file.name, `.${extension}`);
                    console.log(`${fileName} - ${extension} - ${Number(size / 1024).toFixed(3)}kb`);
                } else if (stats.isDirectory()) {
                    return;
                }
            });
        });
    }
});