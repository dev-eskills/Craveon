import { io } from 'socket.io-client';
import api from '../utils/axios';

// Dynamically derive the socket URL from the axios instance baseURL
// const getSocketUrl = () => {
//   const baseURL = api.defaults.baseURL || '';
//   console.log(baseURL, "base url from axios to socket");
//   // Remove trailing /api and adjust port to backend (3001)
//   const withoutApi = baseURL.replace(/\/api\/?$/, '');
//   // If the URL contains port 3000 (frontend dev), change to 3001 (backend)
//   return withoutApi.replace(/:3000(?!\d)/, ':3001');
// };

const SOCKET_URL =  'http://localhost:3000';
console.log(SOCKET_URL, "socket url")
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

export const connectSocket = () => {
  if (!socket.connected) {
    console.log("connected")
    socket.connect();
  }else{
    console.log(socket , "socket not connected")
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    console.log("disconnected")
    socket.disconnect();
  }
};

export default socket;