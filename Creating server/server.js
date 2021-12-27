const http = require("http");
const path = require("path");
const fs = require("fs");
const url = require("url");

const port = 5000;
const hostName = "localhost";

const server = http.createServer((req, res) => {
  const uri = url.parse(req.url).pathname;
  const filePath = path.join(process.cwd(), unescape(uri));
  console.log(filePath);
  let loadFile;
  try {
    loadFile = fs.lstatSync(filePath);
  } catch (err) {
    res.write("404 File not found");
    res.end();
    return;
  }
  if (loadFile.isFile()) {
    res.writeHead(200, { "Content-Type": "text/html" });
    let fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else if (loadFile.isDirectory()) {
    res.writeHead(302, { Location: uri + "/index.html" });
    res.end();
  } else {
    res.write("500 Internal Server Error");
  }
});

server.listen(port, hostName, () => {
  console.log("Server is running");
});
