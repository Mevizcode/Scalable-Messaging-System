import socket from '../config/socketIO.js';

let io = socket.getSocketInstance();

export const privateMessage = async ({ senderId, receiverId, content, timestamp }) => {
    if (!io) return;

    const privateRoomId = [senderId, receiverId].sort().join("-");

    io.to(privateRoomId).emit('private_message', {
        privateRoomId,
        senderId,
        message: content,
        timestamp
    });

    console.log(`Message sent to room ${privateRoomId}:`, content);
};

export const groupMessage = async ({ senderId, groupId, content, timestamp }) => {
    if (!io) return;

    const groupRoomId = `group-${groupId}`;

    io.to(groupRoomId).emit('group_message', {
        groupId,
        senderId,
        message: content,
        timestamp
    });

    console.log(`Message sent to ${groupRoomId} - ${content}`);
};