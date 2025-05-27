'use client';
import React, {
  useCallback,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface Message {
  content: string;
  from: 'me' | 'server';
}

interface ISocketContext {
  sendMessage: (msg: string) => void;
  messages: Message[];
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('SocketContext is undefined');
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:8080', {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to socket:', socket.id);
    });

    socket.on('event:message', ({ message, from }: { message: string; from: string }) => {
      if (!socket.id || from === socket.id) return; // Don't add own message again
      setMessages((prev) => [...prev, { content: message, from: 'server' }]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = useCallback((msg: string) => {
    const socket = socketRef.current;
    if (socket) {
      socket.emit('event:message', { message: msg, from: socket.id });
      setMessages((prev) => [...prev, { content: msg, from: 'me' }]);
    } else {
      console.warn('⚠️ Socket not connected.');
    }
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};