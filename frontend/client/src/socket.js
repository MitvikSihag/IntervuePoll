import { io } from 'socket.io-client';

const socket = io('https://intervuepoll-2rn3.onrender.com', {
  withCredentials: true,
  autoConnect: true,
});

// Optional: log connection status
socket.on('connect', () => {
  console.log('🟢 Connected to backend:', socket.id);
});

socket.on('disconnect', () => {
  console.log('🔌 Disconnected from backend');
});

// For devtools debugging
if (typeof window !== 'undefined') {
  window.socket = socket;
}

export default socket;
