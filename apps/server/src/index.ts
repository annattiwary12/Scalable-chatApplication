import http from 'http';
import SocketService from './services/socket';
import {startMessageConsumer} from './services/kafka';
import 'dotenv/config';
 // To load environment variables

async function init() {
  startMessageConsumer(); // 
  const httpServer = http.createServer(); // 1️ Create server first

  const socketService = new SocketService(httpServer); // 2️ Pass it to the SocketService

  const PORT = process.env.PORT || 8080;
  httpServer.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
  });
  

  socketService.initListeners(); // 3️ Start socket listeners
}

init();