import { Server } from 'socket.io';
import { handleSocketEvents } from '../utils/socketEvents.js';

// Initialize Socket.IO
export const initSocket = (server, options = {}) => {
    const io = new Server(server, options);

    io.on('connection', (socket) => {
        console.log(`Socket ${socket.id} connected`);
        handleSocketEvents(socket);

        socket.on('disconnect', () => {
            console.log(`Socket ${socket.id} disconnected`);
            socket.removeAllListeners();
        });
    });

    return io;
};

export const getSocketInstance = () => {
    const io = initSocket();
    if (!io) {
        throw new Error("Socket.IO instance not initialized.");
    }
    return io;
};

export default { initSocket, getSocketInstance };