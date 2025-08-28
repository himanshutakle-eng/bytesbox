// import { useAuthContext } from "@/contexts/AuthContext";
// import { useCallback, useState } from "react";

// interface InstantMessage {
//   id: string;
//   text: string;
//   senderId: string;
//   createdAt: Date;
//   tempId?: string;
//   isInstant?: boolean; // Flag for instant display
//   status?: "sending" | "sent" | "failed";
// }

// export const useInstantMessage = () => {
//   const { user } = useAuthContext();
//   const [instantMessages, setInstantMessages] = useState<InstantMessage[]>([]);

//   const addInstantMessage = useCallback(
//     (text: string): string => {
//       const tempId = `temp_${Date.now()}_${Math.random()}`;
//       const newMessage: InstantMessage = {
//         id: tempId,
//         tempId,
//         text,
//         senderId: user?.uid || "",
//         createdAt: new Date(),
//         isInstant: true,
//         status: "sending",
//       };

//       setInstantMessages((prev) => [newMessage, ...prev]);
//       return tempId;
//     },
//     [user?.uid]
//   );

//   const updateMessageStatus = useCallback(
//     (
//       tempId: string,
//       status: "sent" | "failed" | "sending",
//       realId?: string
//     ) => {
//       setInstantMessages((prev) =>
//         prev.map((msg) =>
//           msg.tempId === tempId ? { ...msg, status, id: realId || msg.id } : msg
//         )
//       );
//     },
//     []
//   );

//   const removeInstantMessage = useCallback((tempId: string) => {
//     setInstantMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
//   }, []);

//   const clearInstantMessages = useCallback(() => {
//     setInstantMessages([]);
//   }, []);

//   return {
//     instantMessages,
//     addInstantMessage,
//     updateMessageStatus,
//     removeInstantMessage,
//     clearInstantMessages,
//   };
// };

import { useState } from "react";

interface ReplyMessage {
  id: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  senderId: string;
  senderName?: string;
}

interface InstantMessage {
  tempId: string;
  text: string;
  createdAt: Date;
  status: "sending" | "sent" | "failed";
  isInstant: true;
  replyTo?: ReplyMessage;
}

export const useInstantMessage = () => {
  const [instantMessages, setInstantMessages] = useState<InstantMessage[]>([]);

  const addInstantMessage = (text: string, replyTo?: ReplyMessage) => {
    const tempId = `instant_${Date.now()}_${Math.random()}`;
    const newMessage: InstantMessage = {
      tempId,
      text,
      createdAt: new Date(),
      status: "sending",
      isInstant: true,
      replyTo,
    };

    setInstantMessages((prev) => [newMessage, ...prev]);
    return tempId;
  };

  const updateMessageStatus = (
    tempId: string,
    status: "sending" | "sent" | "failed"
  ) => {
    setInstantMessages((prev) =>
      prev.map((msg) => (msg.tempId === tempId ? { ...msg, status } : msg))
    );
  };

  const removeInstantMessage = (tempId: string) => {
    setInstantMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
  };

  const clearAllInstantMessages = () => {
    setInstantMessages([]);
  };

  return {
    instantMessages,
    addInstantMessage,
    updateMessageStatus,
    removeInstantMessage,
    clearAllInstantMessages,
  };
};
