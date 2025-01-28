import { Server } from 'socket.io';
import { handleSocketEvents } from '../utils/socketEvents.js';

let io;

const initSocket = (server, options = {}) => {
    io = new Server(server, options);
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        handleSocketEvents(socket);
    });
};

const getSocketInstance = () => {
    if (!io) throw new Error('Socket.IO not initialized');
    return io;
}

export default { initSocket, getSocketInstance };