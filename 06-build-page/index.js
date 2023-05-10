import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/\\/g, '/');
const DIST = path.join(__dirname, "project-dist");
const COMPONENTS = path.join(__dirname, "components");
const ASSETS = path.join(__dirname, "assets");
const STYLES = path.join(__dirname, "styles");
const TEMPLATE = path.join(__dirname, "template.html");

//creating a project-dist folder
fs.promises.access(DIST, fs.constants.F_OK).catch(() => {
    fs.promises.mkdir(DIST);
})
//replacing template tags with file names from the components folder
let template = await fs.promises.readFile(TEMPLATE, "utf-8");
const htmlRegex = /{{\s*(\S+)\s*}}/g;
let match;

while (match = htmlRegex.exec(template)) {
    const [perfectMatch, compName] = match;
    const compPath = path.join(COMPONENTS, `${compName}.html`);
    try {
        const content = await fs.promises.readFile(compPath, "utf-8");
        template = template.replace(perfectMatch, content);
    } catch (error) {
        console.error(`Error reading file ${compPath}: ${error.message}`);
    }
}

//getting all the styles and placing them in the styles.css in project-dist
const cssStyles = [];
const files = await fs.promises.readdir(STYLES);
for (const file of files) {
    const filePath = path.join(STYLES, file);
    if (path.extname(file) === ".css") {
        cssStyles.push(await fs.promises.readFile(filePath, "utf-8"));
    }
}

await fs.promises.writeFile(path.join(DIST, "style.css"), cssStyles.join("\n"));

//copying the assets folder into project-dist/assets dir

const copyFile = (src, dest) => {
    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);
    readStream.pipe(writeStream);
}

const copyDir = async (srcDir, destDir) => {
    await fs.promises.mkdir(destDir, {recursive: true});

    const files = await fs.promises.readdir(srcDir);
    for (const file of files) {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);
        if ((await fs.promises.stat(srcPath)).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    }
}
await copyDir(ASSETS, path.join(DIST, "assets"));

//updating the template with code from components

await fs.promises.writeFile(path.join(DIST, "index.html"), template);