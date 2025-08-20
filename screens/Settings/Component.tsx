import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router, useNavigation } from "expo-router";
import React from "react";
import Settings from "./View";

type Props = {};

const Component = (props: Props) => {
  const navigation = useNavigation();
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

  return <Settings handleLogout={handleLogout} />;
};

export default Component;
