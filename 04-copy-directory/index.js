import fs, { stat, write } from "fs";
import path from "path";


const __dirname = path.dirname(new URL(import.meta.url).pathname);
const filesPath = path.join(__dirname, "files");
const newFolderPath = path.join(__dirname, "files-copy");

async function copyDir(src, dest) {
    try {
        await fs.promises.mkdir(dest, {recursive: true});

        const files = await fs.promises.readdir(src, { withFileTypes: true});

        for (const file of files) {
            const srcPath = path.join(src, file.name);
            const destPath = path.join(dest, file.name);

            if (file.isDirectory()) {
                await copyDir(srcPath, destPath);
            } else {
                await fs.promises.copyFile(srcPath, destPath);
            }
        }

        const destFiles = await fs.promises.readdir(dest, { withFileTypes: true});
        destFiles.forEach(async (destFile) => {
            const srcFile = files.find(file => file.name === destFile.name);
            if(!srcFile) {
                const destFilePath = path.join(dest, destFile.name);
                if (destFile.isDirectory()) {
                    await fs.promises.rmdir(destFilePath, {recursive: true});
                } else {
                    await fs.promises.unlink(destFilePath);
                }
            }
        })
        console.log("Files copied successfully!")
    }catch (err)  {
        console.error(`Error copying: ${err}`);
    }
}

copyDir(filesPath, newFolderPath);
