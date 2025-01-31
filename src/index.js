import { createServer } from 'http';
import { app } from './app.js';
import { initSocket } from './config/socketIO.js';
import { config } from './config/default.config.js';

const server = createServer(app);

// Initialize Socket.IO
initSocket(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
    },
});

// Start server
server.listen(config.app.port, () => {
    console.log(`server listening on port ${config.app.port}`);
});
