import { User } from "@/Types";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import ChatView from "./View";

const Component = () => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [otherUser, setOtherUser] = useState<User | null>(null);

  useEffect(() => {
    if (!chatId) return;
    const run = async () => {
      const chat = await firestore()
        .collection("chats")
        .doc(String(chatId))
        .get();
      const parts: string[] = chat.data()?.participants || [];
      const me = auth().currentUser?.uid;
      const otherUid = parts.find((p) => p !== me) || parts[0];
      if (!otherUid) return;
      const unsub = firestore()
        .collection("users")
        .doc(otherUid)
        .onSnapshot((doc) => {
          if (!doc.exists) return;
          setOtherUser({ id: doc.id, ...(doc.data() as any) } as User);
        });
      return () => unsub();
    };
    let cleanup: undefined | (() => void);
    run().then((fn) => {
      if (typeof fn === "function") cleanup = fn;
    });
    return () => {
      if (cleanup) cleanup();
    };
  }, [chatId]);

  return <ChatView otherUser={otherUser} />;
};

export default Component;
