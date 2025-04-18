import { defineStore, storeToRefs } from "pinia";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Unsubscribe,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "@/plugins/firebase";

// Типы
export interface ChatMessage {
  id: string;
  from: string;
  text: string;
  createdAt: any;
}

export interface ChatRoom {
  id: string;
  users: string[]; // например ["user1", "user2"]
}

export const useChatsStore = defineStore("chats", {
  state: () => ({
    chatRooms: [] as ChatRoom[],
    messages: [] as ChatMessage[],
    activeChatId: null as string | null,
    unsubscribe: null as Unsubscribe | null,
  }),

  actions: {
    // Получить все чаты пользователя
    async fetchUserChats(userId: string) {
      const q = query(collection(db, "chats"), where("users", "array-contains", userId));
      const snapshot = await getDocs(q);

      this.chatRooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ChatRoom, "id">),
      }));
    },

    // Получить сообщения по chatId
    async fetchMessages(chatId: string) {
      this.activeChatId = chatId;
      if (this.unsubscribe) this.unsubscribe();

      const q = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy("createdAt")
      );

      this.unsubscribe = onSnapshot(q, (snapshot) => {
        this.messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ChatMessage, "id">),
        }));
      });
    },

    // Отправить сообщение
    async createMessage(text: string, from: string) {
      if (!text.trim() || !this.activeChatId) return;

      await addDoc(collection(db, `chats/${this.activeChatId}/messages`), {
        from,
        text,
        createdAt: serverTimestamp(),
      });
    },

    // Обновить сообщение
    async updateMessage(id: string, newText: string) {
      if (!this.activeChatId) return;
      const messageRef = doc(db, `chats/${this.activeChatId}/messages`, id);
      await updateDoc(messageRef, { text: newText });
    },

    // Удалить сообщение
    async deleteMessage(id: string) {
      if (!this.activeChatId) return;
      const messageRef = doc(db, `chats/${this.activeChatId}/messages`, id);
      await deleteDoc(messageRef);
    },

    // Очистка
    unsubscribeChats() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
      this.messages = [];
      this.activeChatId = null;
    },
  },
});

// Рефы (удобно в setup)
export const useChatsStoreRefs = () => storeToRefs(useChatsStore());