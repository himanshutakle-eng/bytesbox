import { useAuthContext } from "@/contexts/AuthContext";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router, useNavigation } from "expo-router";
import React from "react";
import Settings from "./View";

type Props = {};

const Component = (props: Props) => {
  const navigation = useNavigation();
  const { userData } = useAuthContext();

  const handleLogout = async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();

      if (currentUser) {
        await GoogleSignin.signOut();
      }
      await auth().signOut();
      router.replace("/authentication");
    } catch (error) {
      console.error("Logout error:", error);
      router.replace("/authentication");
    }
  };

  return <Settings handleLogout={handleLogout} user={userData} />;
};

export default Component;
