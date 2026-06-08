import type { connection } from "websocket";
import type { OutgoingMessage } from "./messages/outgoingMessages.js";

interface User {
  id: string;
  name: string;
  conn: connection;
}
interface Room {
  users: User[];
}

export class UserManager {
  private rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map<string, Room>();
  }

  addUser(userId: string, name: string, roomId: string, socket: connection) {
    if (!this.rooms.get(roomId)) {
      this.rooms.set(roomId, {
        users: [],
      });
    }
    this.rooms.get(roomId)?.users.push({
      id: userId,
      name: name,
      conn: socket,
    });
  }

  removeUser(userId: string, roomId: string) {
    const users = this.rooms.get(roomId)?.users;
    if (users) {
      users.filter(({ id }) => id !== userId);
    }
  }

  getUser(userId: string, roomId: string): User | null {
    const user = this.rooms.get(roomId)?.users.find(({ id }) => id === userId);
    return user ?? null;
  }

  broadCast(roomId: string, userId: string, message: OutgoingMessage) {
    const user = this.getUser(userId, roomId);
    if (!user) {
      console.error("User not found");
      return;
    }

    const room = this.rooms.get(roomId);
    if (!room) {
      console.error("Room not found");
      return;
    }

    room.users.forEach(({ conn }) => {
      conn.sendUTF(JSON.stringify(message));
    });
  }
}
