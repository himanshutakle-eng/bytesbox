import { useAuthContext } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useEffect } from "react";
import Splash from "./View";

const Component = () => {
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    let timer;

    if (user) {
      timer = setTimeout(() => router.replace("/(tabs)/chatlist"), 3000);
    } else {
      timer = setTimeout(() => router.replace("/authentication"), 3000);
    }

    return () => clearTimeout(timer);
  }, [user, loading]);

  return <Splash />;
};

export default Component;
