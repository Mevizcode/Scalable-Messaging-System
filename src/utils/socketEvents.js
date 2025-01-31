export const handleSocketEvents = (socket) => {
    const joinRoom = ({ roomId, eventName, successMessage }) => {
        if (!roomId) {
            return socket.emit('error', { message: 'Missing room ID' });
        }

        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);

        // Notify the user
        socket.emit(eventName, { roomId, message: successMessage });

        // Notify others
        socket.to(roomId).emit(`${eventName}_notification`, {
            message: `A user has joined ${roomId}.`,
        });
    };

    // Private conversation
    socket.on('join_conversation', ({ senderId, receiverId }) => {
        if (!senderId || !receiverId) {
            return socket.emit("error", { message: 'Missing sender or receiver ID' });
        }

        const privateRoomId = [senderId, receiverId].sort().join("-");

        joinRoom({
            roomId: privateRoomId,
            eventName: 'joined_conversation',
            successMessage: `You have joined the conversation with ${receiverId}.`,
        });
    });

    // Group chat
    socket.on('join_group', ({ groupId }) => {
        if (!groupId) {
            return socket.emit("error", { message: 'Missing group ID' });
        }

        joinRoom({
            roomId: `group-${groupId}`,
            eventName: 'joined_group',
            successMessage: `You have joined group ${groupId}.`,
        });
    });
};
