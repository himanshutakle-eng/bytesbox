import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import Splash from "./View";

const Component = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), (usr) => {
      setUser(usr);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, [initializing]);

  useEffect(() => {
    if (initializing) return;

    if (user) {
      router.replace("/(tabs)/chatlist");
    } else {
      router.replace("/authentication");
    }
  }, [user, initializing]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("/authentication");
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  return <Splash />;
};

export default Component;
