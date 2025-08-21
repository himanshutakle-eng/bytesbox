// import { useAuthContext } from "@/contexts/AuthContext";
// import { User } from "@/Types";
// import firestore from "@react-native-firebase/firestore";
// import { useLocalSearchParams } from "expo-router";
// import React, { useEffect, useState } from "react";
// import ChatView from "./View";

// const Component = () => {
//   const { chatId } = useLocalSearchParams<{ chatId: string }>();
//   const [otherUser, setOtherUser] = useState<User | null>(null);
//   const { user } = useAuthContext();

//   useEffect(() => {
//     if (!chatId || !user?.uid) return;
//     const run = async () => {
//       const chat = await firestore()
//         .collection("chats")
//         .doc(String(chatId))
//         .get();
//       const parts: string[] = chat.data()?.participants || [];
//       const otherUid = parts.find((p) => p !== user.uid) || parts[0];
//       if (!otherUid) return;
//       const unsub = firestore()
//         .collection("users")
//         .doc(otherUid)
//         .onSnapshot((doc) => {
//           if (!doc.exists) return;
//           setOtherUser({ id: doc.id, ...(doc.data() as any) } as User);
//         });
//       return () => unsub();
//     };
//     let cleanup: undefined | (() => void);
//     run().then((fn) => {
//       if (typeof fn === "function") cleanup = fn;
//     });
//     return () => {
//       if (cleanup) cleanup();
//     };
//   }, [chatId, user?.uid]);

//   return <ChatView otherUser={otherUser} />;
// };

// export default Component;

import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "@/Types";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import ChatView from "./View";

const Component = () => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!chatId || !user?.uid) return;
    const run = async () => {
      setLoading(true);
      const chat = await firestore()
        .collection("chats")
        .doc(String(chatId))
        .get();

      const parts: string[] = chat.data()?.participants || [];
      const otherUid = parts.find((p) => p !== user.uid) || parts[0];
      if (!otherUid) {
        setLoading(false);
        return;
      }

      const unsub = firestore()
        .collection("users")
        .doc(otherUid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setOtherUser({ id: doc.id, ...(doc.data() as any) } as User);
          }
          setLoading(false);
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
  }, [chatId, user?.uid]);

  return <ChatView otherUser={otherUser} loading={loading} />;
};

export default Component;
