import { useAuthContext } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useEffect } from "react";
import Splash from "./View";

const Component = () => {
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/(tabs)/chatlist");
    } else {
      router.replace("/authentication");
    }
  }, [user, loading]);

  return <Splash />;
};

export default Component;
