const buildURL = (endpoint) => `/api${endpoint}`;
const buildWS = (endpoint) => `/ws${endpoint}`;

export const endpoints = {
    login: (roomId) => buildURL('/auth/local'),
    register: (roomId) => buildURL('/auth/local/register'),
    createRoom: (roomId) => buildURL('/chat-rooms'),
    listRooms: (roomId) => buildURL('/chat-rooms'),
    listMessages: (roomId) => buildURL(`/messages/chatroom/${roomId}`),
    messageWS: (roomId) => buildWS(`/message/${roomId}`),
}