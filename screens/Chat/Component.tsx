import { useAuthContext } from "@/contexts/AuthContext";
import { Message, User } from "@/Types";
import { useMessageEncryption } from "@/utils/encrypt";
import { generateTempId } from "@/utils/formateTime";
import { uploadToCloudinary, validateMediaFile } from "@/utils/helper";
import firestore from "@react-native-firebase/firestore";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import ChatView from "./View";

interface PendingMessage extends Message {
  isUploading?: boolean;
  tempId?: string;
  localMediaUri?: string;
  uploadProgress?: number;
  error?: string;
  isEncrypted?: boolean;
  mediaType?: "image" | "video" | "audio";
}

const Component = () => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { user } = useAuthContext();

  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [text, setText] = useState("");
  const recordingInterval = useRef<any>(null);

  const {
    encryptMessage,
    decryptMessage,
    isEncrypted,
    encryptMediaUri,
    decryptMediaUri,
  } = useMessageEncryption();

  useEffect(() => {
    if (!chatId || !user?.uid) return;

    setLoading(true);
    const fetchOtherUser = async () => {
      const chat = await firestore().collection("chats").doc(chatId).get();
      const parts: string[] = chat.data()?.participants || [];
      const otherUid = parts.find((p) => p !== user.uid);
      if (!otherUid) return setLoading(false);

      return firestore()
        .collection("users")
        .doc(otherUid)
        .onSnapshot((doc) => {
          setOtherUser({ id: doc.id, ...(doc.data() as any) });
          setLoading(false);
        });
    };

    let unsub: any;
    fetchOtherUser().then((fn) => (unsub = fn));
    return () => unsub?.();
  }, [chatId, user?.uid]);

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data() as any;
          console.log("this is data : ", data);

          console.log("this is data : ", data);
          if (data.text && isEncrypted(data.text)) {
            data.text = decryptMessage(data.text);
            data.isEncrypted = true;
          }

          if (data.mediaUrl && isEncrypted(data?.mediaUrl)) {
            data.mediaUrl = decryptMediaUri(data?.mediaUrl);
            data.isEncrypted = true;
          }

          console.log("thisi is media -----", data);

          return { id: d.id, ...data };
        }) as Message[];

        setMessages(list);
      });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    Audio.requestPermissionsAsync();
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  const sendMediaWithPreview = async (
    uri: string,
    type: "image" | "video" | "audio"
  ) => {
    if (!chatId || !user?.uid) return;

    const tempId = generateTempId();
    const tempMsg: PendingMessage = {
      id: tempId,
      tempId,
      senderId: user.uid,
      createdAt: new Date(),
      localMediaUri: uri,
      mediaType: type,
      isUploading: true,
    };
    setPendingMessages((prev) => [tempMsg, ...prev]);

    try {
      const mediaUrl = await uploadToCloudinary(uri, type);
      const encrypted = encryptMediaUri(mediaUrl);
      await firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .add({
          senderId: user.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
          mediaUrl: encrypted,
          mediaType: type,
        });

      const label =
        type === "image"
          ? "📷 Photo"
          : type === "video"
          ? "🎥 Video"
          : "🎵 Audio";
      await firestore()
        .collection("chats")
        .doc(chatId)
        .set(
          {
            lastMessage: {
              text: label,
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          },
          { merge: true }
        );
      setPendingMessages((prev) => prev.filter((m) => m.tempId !== tempId));
    } catch (e) {
      console.error("Media send error:", e);
      setPendingMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId
            ? { ...m, isUploading: false, error: "Upload failed" }
            : m
        )
      );
      setTimeout(
        () =>
          setPendingMessages((prev) => prev.filter((m) => m.tempId !== tempId)),
        5000
      );
    }
  };

  const pickMedia = async (source: "camera" | "library" | "document") => {
    try {
      let result: any;
      if (source === "library") {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images", "videos"],
          quality: 1,
          allowsEditing: false,
        });
      } else if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images", "videos"],
          quality: 1,
        });
      } else {
        result = await DocumentPicker.getDocumentAsync({
          type: "audio/*",
          copyToCacheDirectory: true,
        });
      }

      setShowMediaOptions(false);
      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const type =
        source === "document"
          ? "audio"
          : asset.type === "video" ||
            asset.uri.includes(".mp4") ||
            asset.uri.includes(".mov")
          ? "video"
          : "image";

      if (!validateMediaFile(asset, type)) return;
      await sendMediaWithPreview(asset.uri, type);
    } catch (e) {
      console.error(`${source} picker error:`, e);
      Alert.alert("Error", `Failed to pick ${source} media.`);
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow microphone access.");
        return;
      }

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(rec);
      setIsRecording(true);
      setRecordingDuration(0);

      recordingInterval.current = setInterval(
        () => setRecordingDuration((d) => d + 1000),
        1000
      );
    } catch (e) {
      console.error("Recording start error:", e);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    clearInterval(recordingInterval.current);
    setIsRecording(false);

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    setRecordingDuration(0);

    if (uri) await sendMediaWithPreview(uri, "audio");
  };

  const cancelRecording = async () => {
    if (!recording) return;
    clearInterval(recordingInterval.current);
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    setRecording(null);
    setRecordingDuration(0);
  };

  const sendTextMessage = async (txt: any) => {
    if (!txt.trim() || !chatId || !user?.uid) return;
    const tempId = generateTempId();
    const plain = txt.trim();
    const encrypted = encryptMessage(plain);

    console.log("-------encrypted :", encrypted);

    setText("");
    setPendingMessages((prev) => [
      {
        id: tempId,
        tempId,
        text: plain,
        senderId: user.uid,
        createdAt: new Date(),
        isUploading: true,
      },
      ...prev,
    ]);

    try {
      await firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .add({
          text: encrypted,
          senderId: user.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
          isEncrypted: true,
        });
      await firestore()
        .collection("chats")
        .doc(chatId)
        .set(
          {
            lastMessage: {
              text: plain,
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          },
          { merge: true }
        );
      setPendingMessages((prev) => prev.filter((m) => m.tempId !== tempId));
    } catch {
      setPendingMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId
            ? { ...m, isUploading: false, error: "Send failed" }
            : m
        )
      );
      setTimeout(() => {
        setPendingMessages((prev) => prev.filter((m) => m.tempId !== tempId));
        setText(plain);
      }, 3000);
    }
  };

  const retryFailedMessage = (tempId: string) => {
    const failed = pendingMessages.find((m) => m.tempId === tempId);
    if (!failed) return;
    setPendingMessages((prev) => prev.filter((m) => m.tempId !== tempId));
    failed.localMediaUri && failed.mediaType
      ? sendMediaWithPreview(failed.localMediaUri, failed.mediaType)
      : failed.text && setText(failed.text);
  };

  return (
    <ChatView
      otherUser={otherUser}
      loading={loading}
      handleImagePicker={() => pickMedia("library")}
      handleCameraPicker={() => pickMedia("camera")}
      handleDocumentPicker={() => pickMedia("document")}
      startRecording={startRecording}
      stopRecording={stopRecording}
      cancelRecording={cancelRecording}
      sendTextMessage={sendTextMessage}
      retryFailedMessage={retryFailedMessage}
      showMediaOptions={showMediaOptions}
      setShowMediaOptions={setShowMediaOptions}
      pendingMessages={pendingMessages}
      messages={messages}
      isRecording={isRecording}
      recordingDuration={recordingDuration}
      text={text}
      setText={setText}
    />
  );
};

export default Component;
