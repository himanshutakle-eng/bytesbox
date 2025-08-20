import { useThemeContext } from "@/contexts/ThemeContexts";
import { useConnections } from "@/hooks/useRequest";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import Request from "./View";

type Props = {};

const Component = (props: Props) => {
  const { incomingRequests, outgoingRequests, declinedConnections } =
    useConnections();
  const { colors } = useThemeContext();
  const [activeTab, setActiveTab] = useState<"Received" | "Sent" | "Declined">(
    "Received"
  );
  const { t } = useTranslation();

  // const acceptRequest = async (fromUserId: string) => {
  //   const auth = getAuth();
  //   const toUserId = auth.currentUser?.uid;
  //   if (!toUserId) return;

  //   const batch = firestore().batch();
  //   const fromRef = firestore().collection("users").doc(fromUserId);
  //   const toRef = firestore().collection("users").doc(toUserId);

  //   batch.update(fromRef, {
  //     connections: firestore.FieldValue.arrayRemove({
  //       uid: toUserId,
  //       status: "pending",
  //       direction: "outgoing",
  //     }),
  //   });
  //   batch.update(fromRef, {
  //     connections: firestore.FieldValue.arrayUnion({
  //       uid: toUserId,
  //       status: "accepted",
  //       direction: "outgoing",
  //     }),
  //   });

  //   batch.update(toRef, {
  //     connections: firestore.FieldValue.arrayRemove({
  //       uid: fromUserId,
  //       status: "pending",
  //       direction: "incoming",
  //     }),
  //   });
  //   batch.update(toRef, {
  //     connections: firestore.FieldValue.arrayUnion({
  //       uid: fromUserId,
  //       status: "accepted",
  //       direction: "incoming",
  //     }),
  //   });

  //   const chatId =
  //     fromUserId < toUserId
  //       ? `${fromUserId}_${toUserId}`
  //       : `${toUserId}_${fromUserId}`;

  //   batch.set(firestore().collection("chats").doc(chatId), {
  //     participants: [fromUserId, toUserId],
  //     createdAt: firestore.FieldValue.serverTimestamp(),
  //   });

  //   await batch.commit();
  // };

  console.log("incomin request", incomingRequests);
  console.log("outgoingRequests request", outgoingRequests);

  const acceptRequest = async (fromUserId: string) => {
    const auth = getAuth();
    const toUserId = auth.currentUser?.uid;
    if (!toUserId) return;

    const batch = firestore().batch();

    const fromRef = firestore().collection("users").doc(fromUserId);
    const toRef = firestore().collection("users").doc(toUserId);

    batch.update(fromRef, {
      connections: firestore.FieldValue.arrayRemove({
        uid: toUserId,
        status: "pending",
        direction: "outgoing",
      }),
    });
    batch.update(fromRef, {
      connections: firestore.FieldValue.arrayUnion({
        uid: toUserId,
        status: "accepted",
        direction: "outgoing",
      }),
    });

    batch.update(toRef, {
      connections: firestore.FieldValue.arrayRemove({
        uid: fromUserId,
        status: "pending",
        direction: "incoming",
      }),
    });
    batch.update(toRef, {
      connections: firestore.FieldValue.arrayUnion({
        uid: fromUserId,
        status: "accepted",
        direction: "incoming",
      }),
    });

    // Create chat doc
    const chatId =
      fromUserId < toUserId
        ? `${fromUserId}_${toUserId}`
        : `${toUserId}_${fromUserId}`;

    batch.set(firestore().collection("chats").doc(chatId), {
      participants: [fromUserId, toUserId],
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();
    router.replace("/(tabs)/chatlist");
  };

  const declineRequest = async (fromUserId: string) => {
    const auth = getAuth();
    const toUserId = auth.currentUser?.uid;
    if (!toUserId) return;

    const batch = firestore().batch();
    const fromRef = firestore().collection("users").doc(fromUserId);
    const toRef = firestore().collection("users").doc(toUserId);

    batch.update(fromRef, {
      connections: firestore.FieldValue.arrayRemove({
        uid: toUserId,
        status: "pending",
        direction: "outgoing",
      }),
    });
    batch.update(fromRef, {
      connections: firestore.FieldValue.arrayUnion({
        uid: toUserId,
        status: "declined",
        direction: "outgoing",
      }),
    });

    batch.update(toRef, {
      connections: firestore.FieldValue.arrayRemove({
        uid: fromUserId,
        status: "pending",
        direction: "incoming",
      }),
    });
    batch.update(toRef, {
      connections: firestore.FieldValue.arrayUnion({
        uid: fromUserId,
        status: "declined",
        direction: "incoming",
      }),
    });

    await batch.commit();
  };

  const requestAgain = async (toUserId: string) => {
    const auth = getAuth();
    const fromUserId = auth.currentUser?.uid;
    if (!fromUserId || fromUserId === toUserId) return;

    const batch = firestore().batch();
    const fromRef = firestore().collection("users").doc(fromUserId);
    const toRef = firestore().collection("users").doc(toUserId);

    // Remove any declined state if present
    batch.update(fromRef, {
      connections: firestore.FieldValue.arrayRemove({
        uid: toUserId,
        status: "declined",
        direction: "outgoing",
      }),
    });
    batch.update(toRef, {
      connections: firestore.FieldValue.arrayRemove({
        uid: fromUserId,
        status: "declined",
        direction: "incoming",
      }),
    });

    // Add pending again
    batch.update(fromRef, {
      connections: firestore.FieldValue.arrayUnion({
        uid: toUserId,
        status: "pending",
        direction: "outgoing",
      }),
    });
    batch.update(toRef, {
      connections: firestore.FieldValue.arrayUnion({
        uid: fromUserId,
        status: "pending",
        direction: "incoming",
      }),
    });

    await batch.commit();
  };

  return (
    <Request
      data={
        activeTab === "Received"
          ? incomingRequests
          : activeTab === "Sent"
          ? outgoingRequests
          : declinedConnections
      }
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onAccept={acceptRequest}
      onDecline={declineRequest}
      onRequestAgain={requestAgain}
    />
  );
};

export default Component;

const styles = StyleSheet.create({});
