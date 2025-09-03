import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { User } from "@/Types";
import firestore from "@react-native-firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ChatList from "./View";

type Props = {};

const Component = (props: Props) => {
  const { colors } = useThemeContext();
  const { user } = useAuthContext();
  const { t } = useTranslation();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchChats = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const snapshot = await firestore()
        .collection("chats")
        .where("participants", "array-contains", user.uid)
        .get();

      const items = await Promise.all(
        snapshot.docs.map(async (d) => {
          const data: any = d.data();
          const otherUid = (data.participants || []).find(
            (p: string) => p !== user.uid
          );
          let otherUser: Partial<User> | undefined = undefined;
          if (otherUid) {
            const u = await firestore().collection("users").doc(otherUid).get();
            otherUser = { id: u.id, ...(u.data() as any) };
          }
          return { id: d.id, ...data, otherUser };
        })
      );

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
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Real-time updates
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = firestore()
      .collection("chats")
      .where("participants", "array-contains", user.uid)
      .onSnapshot(async (snap) => {
        const items = await Promise.all(
          snap.docs.map(async (d) => {
            const data: any = d.data();
            const otherUid = (data.participants || []).find(
              (p: string) => p !== user.uid
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
  }, [user?.uid]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChats();
  }, [fetchChats]);

  return (
    <ChatList
      data={chats}
      loading={loading}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};

export default Component;
