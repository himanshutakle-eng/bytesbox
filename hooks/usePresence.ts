import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export function usePresence() {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    const userRef = firestore().collection("users").doc(uid);

    // Mark online on mount
    userRef.set(
      {
        status: "online",
        lastSeen: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const handleChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        userRef.set(
          {
            status: "online",
            lastSeen: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      } else if (nextAppState.match(/inactive|background/)) {
        userRef.set(
          {
            status: "offline",
            lastSeen: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
      appState.current = nextAppState;
    };

    const sub = AppState.addEventListener("change", handleChange);

    return () => {
      sub.remove();
      userRef.set(
        { status: "offline", lastSeen: firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
    };
  }, []);
}
