import CustomLoader from "@/components/ui/CustomLoader";
import { User } from "@/Types";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Users from "./View";

type Props = {};

const Component = (props: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const { t } = useTranslation();

  const { user: userScreen } = useLocalSearchParams();

  useEffect(() => {
    getAllUsersExceptCurrent();
  }, [navigate, requestLoading]);

  const getAllUsersExceptCurrent = async () => {
    setLoading(true);
    try {
      const currentUser: any = getAuth().currentUser;
      if (!currentUser) {
        console.warn("no current user loggedIn !");
      }

      const snapshot = await firestore().collection("users").get();

      const fetchedUsers: User[] = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as User))
        .filter((user) => user.id !== currentUser.uid);
      setLoading(false);
      setUsers(fetchedUsers);
    } catch (error) {
      setLoading(false);
      console.error("something went wrong !");
    } finally {
      setLoading(false);
    }
  };

  // const sendRequest = async (toUserId: string) => {
  //   setRequestLoading(true);
  //   try {
  //     const auth = getAuth();
  //     const fromUserId = auth.currentUser?.uid;

  //     if (!fromUserId || fromUserId === toUserId) return;

  //     const batch = firestore().batch();

  //     const fromRef = firestore().collection("users").doc(fromUserId);
  //     const toRef = firestore().collection("users").doc(toUserId);

  //     batch.update(fromRef, {
  //       connections: firestore.FieldValue.arrayUnion({
  //         uid: toUserId,
  //         status: "pending",
  //         direction: "outgoing",
  //         fromUserId: fromUserId,
  //       }),
  //     });

  //     batch.update(toRef, {
  //       connections: firestore.FieldValue.arrayUnion({
  //         uid: fromUserId,
  //         status: "pending",
  //         direction: "incoming",
  //         toUserId: toUserId,
  //       }),
  //     });

  //     await batch.commit();
  //     setRequestLoading(false);
  //   } catch (error) {
  //     console.warn("this is error :", error);
  //     setRequestLoading(false);
  //   } finally {
  //     setRequestLoading(false);
  //   }
  // };

  const sendRequest = async (toUserId: string) => {
    setRequestLoading(true);
    try {
      const auth = getAuth();
      const fromUserId = auth.currentUser?.uid;

      if (!fromUserId || fromUserId === toUserId) return;

      const batch = firestore().batch();

      const fromRef = firestore().collection("users").doc(fromUserId);
      const toRef = firestore().collection("users").doc(toUserId);

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
    } catch (error) {
      console.warn("Send request error:", error);
    } finally {
      setRequestLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.userName, u.email]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query, users]);

  if (loading || requestLoading) {
    return <CustomLoader message={t("common.loading_fetch")} />;
  }

  return (
    <Users
      data={filteredUsers}
      onPress={sendRequest}
      params={userScreen}
      query={query}
      setQuery={setQuery}
    />
  );
};

export default Component;
