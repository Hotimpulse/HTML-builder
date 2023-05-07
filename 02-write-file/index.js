import fs from "fs";
import readline from "readline";

const fileName = "output.txt";
const filePath = `./02-write-file/${fileName}`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const appendData = data => {
    fs.appendFile(filePath, data, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Data added!");
    })
};

rl.question("Greetings! Enter your message: ", (input) => {
    if (input === "exit") {
        console.log("Goodbye!");
        rl.close();
    }else {
        appendData(input + "\n");
    }
})

rl.on("line", (input) => {
    if (input === "exit") {
        console.log("Goodbye!");
        rl.close();
    }else {
        appendData(input + "\n");
    }
})

rl.on("SIGINT", () => {
    console.log("Goodbye!");
    rl.close();
})