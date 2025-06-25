import app from './app';
import { createServer } from 'http';
import { initSocketServer } from './sockets/socketServer';

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);

// Initialize Socket.IO
initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
