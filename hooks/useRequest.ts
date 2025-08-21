import { useAuthContext } from "@/contexts/AuthContext";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

export function useConnections() {
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<any[]>([]);
  const [declinedConnections, setDeclinedConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUser = async (uid: string) => {
      const userSnap = await firestore().collection("users").doc(uid).get();
      return { id: userSnap.id, ...userSnap.data() };
    };

    const unsubscribe = firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot(async (doc) => {
        if (!doc.exists) return;

        const data = doc.data();
        const connections = data?.connections || [];

        // filter groups
        const incoming = connections.filter(
          (c: any) => c.status === "pending" && c.direction === "incoming"
        );
        const outgoing = connections.filter(
          (c: any) => c.status === "pending" && c.direction === "outgoing"
        );
        const accepted = connections.filter(
          (c: any) => c.status === "accepted"
        );
        const declined = connections.filter(
          (c: any) => c.status === "declined" || c.status === "rejected"
        );

        // fetch users for each
        const incomingWithUser = await Promise.all(
          incoming.map(async (c: any) => ({
            ...c,
            user: await fetchUser(c.uid),
          }))
        );

        const outgoingWithUser = await Promise.all(
          outgoing.map(async (c: any) => ({
            ...c,
            user: await fetchUser(c.uid),
          }))
        );

        const acceptedWithUser = await Promise.all(
          accepted.map(async (c: any) => ({
            ...c,
            user: await fetchUser(c.uid === user.uid ? c.toUserId : c.uid),
          }))
        );

        const declinedWithUser = await Promise.all(
          declined.map(async (c: any) => ({
            ...c,
            user: await fetchUser(c.uid === user.uid ? c.toUserId : c.uid),
          }))
        );

        // update states
        setIncomingRequests(incomingWithUser);
        setOutgoingRequests(outgoingWithUser);
        setAcceptedConnections(acceptedWithUser);
        setDeclinedConnections(declinedWithUser);

        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return {
    incomingRequests,
    outgoingRequests,
    acceptedConnections,
    declinedConnections,
    loading,
  };
}
