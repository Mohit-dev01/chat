import { Store, type Chat, type UserId } from "./Store.js";

let globalChatId = 0;
export interface Room {
  roomId: string;
  chats: Chat[];
}
export class InMemoryStore extends Store {
  private store: Map<string, Room>;

  constructor() {
    super();
    this.store = new Map<string, Room>();
  }

  initRoom(roomId: string) {
    this.store.set(roomId, {
      roomId,
      chats: [],
    });
  }

  getChats(roomId: string, limit: number, offset: number) {
    const room = this.store.get(roomId);
    if (!room) {
      return [];
    }
    return room.chats
      .reverse()
      .slice(0, offset)
      .slice(-1 * limit);
  }

  addChat(userId: UserId, roomId: string, name: string, message: string) {
    const room = this.store.get(roomId);
    if (!room) {
      return;
    }
    room.chats.push({
      id: (globalChatId++).toString(),
      userId,
      message,
      name,
      upvotes: [],
    });
  }

  upvote(chatId: string, userId: string, roomId: string): void {
    const room = this.store.get(roomId);
    if (!room) {
      return;
    }

    const chat = room.chats.find(({ id }) => id === chatId);

    if (chat) {
      chat.upvotes.push(userId);
    }
  }
}
