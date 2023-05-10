import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const stylesFolder = path.join(__dirname, "styles");
const distFolder = path.join(__dirname, "project-dist");

const getStyles = async () => {
    const files = await fs.promises.readdir(stylesFolder);

    const cssFiles = files.filter(file => {
        const extension = path.extname(file);
        return extension === ".css";
    })

    const cssStyles = await Promise.all(cssFiles.map(async (file) => {
        const stylePath = path.join(stylesFolder, file);
        const contents = await fs.promises.readFile(stylePath, "utf-8");
        return contents;
    }))

    const cssBundle = cssStyles.join("\n");
    return cssBundle;
}

const writeToBundle = async cssBundle => {
    const bundlePath = path.join(distFolder, "bundle.css");
    await fs.promises.writeFile(bundlePath, cssBundle);
}

(async () => {
    try {
        const bundle = await getStyles();
        await writeToBundle(bundle);
        console.log("Bundle created!")
    } catch (err) {
        console.error(err);
    }
})();