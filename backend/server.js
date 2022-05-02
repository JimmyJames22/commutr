// dependencies
let winston = require("winston"); // logger
var http = require("http"); // server
const url = require("url"); // url parser

// variables
const serverPort = 8081;

// setup logger
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

// code for server
http.createServer(function (req, res){ // request => req & response => res
  // parse url
  logger.info(req.url);
  const parsedUrl = url.parse(req.url, true);

  // base path
  if (parsedUrl.pathname == "/") {
    res.write("base case");
    res.end();
  }

  
}).listen(serverPort); // start server on serverPort

logger.info(`Server running on port ${serverPort}`)
