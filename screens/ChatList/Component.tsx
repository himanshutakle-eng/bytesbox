import { useThemeContext } from "@/contexts/ThemeContexts";
import { User } from "@/Types";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ChatList from "./View";

type Props = {};

const Component = (props: Props) => {
  const { isDark, colors } = useThemeContext();
  const { t } = useTranslation();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const auth = getAuth();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const unsubscribe = firestore()
      .collection("chats")
      .where("participants", "array-contains", uid)
      .onSnapshot(async (snap) => {
        const items = await Promise.all(
          snap.docs.map(async (d) => {
            const data: any = d.data();
            const otherUid = (data.participants || []).find(
              (p: string) => p !== uid
            );
            let otherUser: Partial<User> | undefined = undefined;
            if (otherUid) {
              const u = await firestore()
                .collection("users")
                .doc(otherUid)
                .get();
              otherUser = { id: u.id, ...(u.data() as any) };
            }
            return { id: d.id, ...data, otherUser };
          })
        );
        // Hydrate lastMessage for preview
        const withLast = await Promise.all(
          items.map(async (it: any) => {
            if (it.lastMessage) return it;
            const lastSnap = await firestore()
              .collection("chats")
              .doc(it.id)
              .collection("messages")
              .orderBy("createdAt", "desc")
              .limit(1)
              .get();
            const lastMsg = lastSnap.docs[0]?.data();
            return { ...it, lastMessage: lastMsg };
          })
        );
        withLast.sort(
          (a: any, b: any) =>
            (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
        );
        setChats(withLast);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);
  return <ChatList data={chats} loading={loading} />;
};

export default Component;
