import http from 'http';
import fs from 'fs';
import url from 'url';
import mime from 'mime-types';
import path from 'path';

let lookup = mime.lookup; // alias for mime.lookup
let port: number = 3000;
let host: string = "localhost";


// creating an instance of the server object
let server = http.createServer((req, res)=>{

    let rawURL = req.url as string;
    let parsedURL = new URL(rawURL, `http://${host}:${port}`);
    
    let parsedPath = parsedURL.pathname.replace(/^\/+|\/+$/g, "");
    if(parsedPath == "")
    {
        parsedPath = "index.html";
    }

    let file = path.join(__dirname, "./Client") + "\\" + parsedPath;
    console.log(file);

    readHTML(file, parsedPath, req, res);
    
});

function readHTML(file: string, parsedPath: string, req: http.IncomingMessage, res: http.ServerResponse, )
{
    fs.readFile(file, (err, data)=>{
        if(err)
        {
            res.writeHead(404); // file not found
            fs.readFile(path.join(__dirname, "./Client") + "\\404.html", (err, fileData)=>{
                res.end(fileData);
            });
            return;
        }
        res.setHeader("X-Content-Type-Options", "nosniff"); // path security
        let mimeType = lookup(parsedPath) as string;
        res.writeHead(200, "", { "Content-Type": mimeType });
        res.end(data);
    });
}

server.listen(port, 'localhost', ()=>{
    console.log(`Listening on Port: ${port}`);
});