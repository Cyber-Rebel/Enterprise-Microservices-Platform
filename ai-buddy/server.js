const app = require('./src/app')
const db = require('./src/db/db.js')
require('dotenv').config();
const http = require('http');
const{ initSocketServer} = require('./src/sockets/sockets.server.js');
const httpServer = http.createServer(app);
initSocketServer(httpServer);
db();

 






httpServer.listen(3005, () => {
console.log(`Server is running on http://localhost:3005`);
})