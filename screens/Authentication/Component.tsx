import CustomLoader from "@/components/ui/CustomLoader";
import auth, { GoogleAuthProvider } from "@react-native-firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Authentication from "./View";

type Props = {};

const Component = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "29616264988-947lj253f2053q5v2vi4uhvrongma49i.apps.googleusercontent.com",
    });
  }, []);

  async function onGoogleButtonPress() {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      await GoogleSignin.signOut();

      const signInResult: any = await GoogleSignin.signIn();

      const idToken = signInResult.data?.idToken || signInResult.idToken;

      if (!idToken) {
        throw new Error("No ID token found");
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);

      const result = await auth().signInWithCredential(googleCredential);

      if (result.user?.email) {
        const db = getFirestore();

        const userData = {
          userName: result.user.displayName || "",
          email: result.user.email,
          role: "user",
          profileUrl: result.user.photoURL || "",
          userPhone: result.user.phoneNumber || "",
          createdAt: serverTimestamp(),
          status: null,
        };

        const userDocRef = doc(collection(db, "users"), result.user.uid);
        await setDoc(userDocRef, userData, { merge: true });

        router.replace("/(tabs)/chatlist");
      } else {
        throw new Error("No email found in user data");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <CustomLoader message={t("common.loading_auth")} />;
  }

  return <Authentication onPress={onGoogleButtonPress} isLoading={isLoading} />;
};

export default Component;
