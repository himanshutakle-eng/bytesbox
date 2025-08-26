import firestore from "@react-native-firebase/firestore";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

export interface ChatMessage {
  id?: string; // Firestore ID
  tempId?: string; // Temporary ID for pending messages
  senderId: string;
  type: "text" | "image" | "video" | "audio" | "file";
  content: string;
  timestamp?: any;
  status?: "pending" | "failed" | "sent";
}

export function useChatMessages(
  conversationId: string,
  userId: string | undefined
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);

  /**
   * Subscribe to Firestore messages
   */
  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(firestore, "conversations", conversationId, "messages"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: ChatMessage[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];

      setMessages(fetched);
    });

    return () => unsubscribe();
  }, [conversationId]);

  /**
   * Send a new message (optimistic update)
   */
  const sendMessage = useCallback(
    async (content: string, type: ChatMessage["type"] = "text") => {
      if (!userId) return;

      const tempId = Date.now().toString();
      const newMessage: ChatMessage = {
        tempId,
        senderId: userId,
        content,
        type,
        status: "pending",
      };

      // Optimistic update
      setPendingMessages((prev) => [newMessage, ...prev]);

      try {
        await addDoc(
          collection(firestore, "conversations", conversationId, "messages"),
          {
            senderId: userId,
            content,
            type,
            timestamp: serverTimestamp(),
          }
        );

        // Remove from pending once confirmed
        setPendingMessages((prev) =>
          prev.filter((msg) => msg.tempId !== tempId)
        );
      } catch (error) {
        console.error("Send message error:", error);

        // Mark as failed
        setPendingMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === tempId ? { ...msg, status: "failed" } : msg
          )
        );
      }
    },
    [conversationId, userId]
  );

  /**
   * Retry sending a failed message
   */
  const retryFailedMessage = useCallback(
    async (tempId: string) => {
      const msg = pendingMessages.find((m) => m.tempId === tempId);
      if (!msg) return;

      try {
        await addDoc(
          collection(firestore, "conversations", conversationId, "messages"),
          {
            senderId: msg.senderId,
            content: msg.content,
            type: msg.type,
            timestamp: serverTimestamp(),
          }
        );

        setPendingMessages((prev) => prev.filter((m) => m.tempId !== tempId));
      } catch (error) {
        Alert.alert("Retry failed", "Could not send the message.");
      }
    },
    [conversationId, pendingMessages]
  );

  /**
   * Merge pending & confirmed messages
   */
  const allMessages = useMemo(
    () => [...pendingMessages, ...messages],
    [pendingMessages, messages]
  );

  return {
    messages: allMessages,
    sendMessage,
    retryFailedMessage,
    pendingMessages,
  };
}
