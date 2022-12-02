"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
let lookup = mime_types_1.default.lookup;
let port = 3000;
let host = "localhost";
let server = http_1.default.createServer((req, res) => {
    let rawURL = req.url;
    let parsedURL = new URL(rawURL, `http://${host}:${port}`);
    let parsedPath = parsedURL.pathname.replace(/^\/+|\/+$/g, "");
    if (parsedPath == "") {
        parsedPath = "index.html";
    }
    let file = path_1.default.join(__dirname, "./Client") + "\\" + parsedPath;
    console.log(file);
    readHTML(file, parsedPath, req, res);
});
function readHTML(file, parsedPath, req, res) {
    fs_1.default.readFile(file, (err, data) => {
        if (err) {
            res.writeHead(404);
            fs_1.default.readFile(path_1.default.join(__dirname, "./Client") + "\\404.html", (err, fileData) => {
                res.end(fileData);
            });
            return;
        }
        res.setHeader("X-Content-Type-Options", "nosniff");
        let mimeType = lookup(parsedPath);
        res.writeHead(200, "", { "Content-Type": mimeType });
        res.end(data);
    });
}
server.listen(port, 'localhost', () => {
    console.log(`Listening on Port: ${port}`);
});
//# sourceMappingURL=server.js.map