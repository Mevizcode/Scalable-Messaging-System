export const handleSocketEvents = (socket) => {
    // a user joins a group room
    socket.on('join_group', (groupId) => {
        socket.join(`group_${groupId}`);
        console.log(`User ${socket.id} joined group: ${groupId}`);
    });

    // user joins an individual conversation room
    socket.on('join_conversation', ({ senderId, receiverId }) => {
        const room = `conversation_${senderId}_${receiverId}`;
        socket.join(room);
        console.log(`User ${socket.id} joined conversation room: ${room}`);
    });
};
