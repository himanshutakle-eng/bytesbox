import CustomLoader from "@/components/ui/CustomLoader";
import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { useKeyboard } from "@/hooks/useKeyboard";
import { usePresence } from "@/hooks/usePresence";
import { Message } from "@/Types";
import { height } from "@/utils/Mixings";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import firestore from "@react-native-firebase/firestore";
import { Audio, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./Styles";

type Props = {
  otherUser?: any | null;
  loading?: boolean;
};

interface PendingMessage extends Message {
  isUploading?: boolean;
  tempId?: string;
  localMediaUri?: string;
  uploadProgress?: number;
  error?: string;
}

const { width: screenWidth } = Dimensions.get("window");

const ChatView = ({ otherUser, loading }: Props) => {
  const { colors } = useThemeContext();
  const { user } = useAuthContext();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [text, setText] = useState("");
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout>();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const formatTime = (ts: any) => {
    try {
      const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
      if (!d) return "";
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const keyboardVisible = useKeyboard();
  usePresence();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {otherUser?.profileUrl ? (
            <Image
              source={{ uri: otherUser.profileUrl }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          ) : (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#777",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>
                {(otherUser?.userName || otherUser?.email || "?").slice(0, 1)}
              </Text>
            </View>
          )}
          <View>
            <Text style={{ fontWeight: "700", color: colors.textPrimary }}>
              {otherUser?.userName || otherUser?.email || ""}
            </Text>
            <Text
              style={{
                fontSize: 11,
                opacity: 0.75,
                color: colors.textSecondary,
              }}
            >
              {otherUser?.status === "online"
                ? t("chat.online")
                : t("chat.last_seen", {
                    time: formatTime(otherUser?.lastSeen),
                  })}
            </Text>
          </View>
        </View>
      ),
      headerBackTitleVisible: false,
    });
  }, [otherUser]);

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = firestore()
      .collection("chats")
      .doc(String(chatId))
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Message[];
        setMessages(list);
      });
    return () => unsubscribe();
  }, [chatId]);

  // Audio setup
  useEffect(() => {
    const setupAudio = async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    };
    setupAudio();
  }, []);

  const uploadToCloudinary = async (
    uri: string,
    type: "image" | "video" | "audio"
  ): Promise<string> => {
    try {
      const data = new FormData();
      let fileType = "image/jpeg";
      let fileName = `upload_${Date.now()}.jpg`;

      switch (type) {
        case "video":
          fileType = "video/mp4";
          fileName = `upload_${Date.now()}.mp4`;
          break;
        case "audio":
          fileType = "audio/m4a";
          fileName = `upload_${Date.now()}.m4a`;
          break;
      }

      data.append("file", {
        uri,
        type: fileType,
        name: fileName,
      } as any);

      data.append("upload_preset", "bytesbox");
      data.append("cloud_name", "dggv1wtws");

      if (type === "video") {
        data.append("resource_type", "video");
        data.append("video_codec", "h264");
        data.append("quality", "auto:good");
      } else if (type === "audio") {
        data.append("resource_type", "video"); // Audio files use video endpoint
      }

      const endpoint = type === "image" ? "image" : "video";
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dggv1wtws/${endpoint}/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      const json = await res.json();
      return json.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const generateTempId = () =>
    `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const validateMediaFile = (asset: any, type: string): boolean => {
    const maxSizeImage = 10 * 1024 * 1024; // 10MB
    const maxSizeVideo = 100 * 1024 * 1024; // 100MB
    const maxSizeAudio = 50 * 1024 * 1024; // 50MB

    let maxSize = maxSizeImage;
    if (type === "video") maxSize = maxSizeVideo;
    if (type === "audio") maxSize = maxSizeAudio;

    if (asset.fileSize && asset.fileSize > maxSize) {
      Alert.alert(
        "File too large",
        `${type} must be smaller than ${maxSize / (1024 * 1024)}MB`
      );
      return false;
    }

    return true;
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 1,
        videoQuality: 1,
        videoMaxDuration: 300, // 5 minutes max
        allowsMultipleSelection: false,
      });

      setShowMediaOptions(false);

      if (result.canceled || !result.assets || result.assets.length === 0)
        return;

      const asset = result.assets[0];

      if (asset.type === "video" && asset.duration && asset.duration > 300000) {
        Alert.alert(
          "Video too long",
          "Please select a video shorter than 5 minutes."
        );
        return;
      }

      const isVideo =
        asset.type === "video" ||
        asset.uri.includes(".mp4") ||
        asset.uri.includes(".mov");
      const mediaType = isVideo ? "video" : "image";

      if (!validateMediaFile(asset, mediaType)) return;

      await sendMediaWithRealTimePreview(asset.uri, mediaType);
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick media. Please try again.");
    }
  };

  const handleCameraPicker = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 1,
        videoQuality: 1,
        videoMaxDuration: 300,
      });

      setShowMediaOptions(false);

      if (result.canceled || !result.assets || result.assets.length === 0)
        return;

      const asset = result.assets[0];
      const isVideo =
        asset.type === "video" ||
        asset.uri.includes(".mp4") ||
        asset.uri.includes(".mov");
      const mediaType = isVideo ? "video" : "image";

      if (!validateMediaFile(asset, mediaType)) return;

      await sendMediaWithRealTimePreview(asset.uri, mediaType);
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to capture media. Please try again.");
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      setShowMediaOptions(false);

      if (result.canceled || !result.assets || result.assets.length === 0)
        return;

      const asset = result.assets[0];

      if (!validateMediaFile(asset, "audio")) return;

      await sendMediaWithRealTimePreview(asset.uri, "audio");
    } catch (error) {
      console.error("Document picker error:", error);
      Alert.alert("Error", "Failed to pick audio file. Please try again.");
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant microphone permission to record audio."
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      recordingInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1000);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording", error);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }

      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      setRecording(null);
      setRecordingDuration(0);

      if (uri) {
        await sendMediaWithRealTimePreview(uri, "audio");
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
      Alert.alert("Error", "Failed to stop recording. Please try again.");
    }
  };

  const cancelRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }

      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      setRecording(null);
      setRecordingDuration(0);
    } catch (error) {
      console.error("Failed to cancel recording", error);
    }
  };

  const sendMediaWithRealTimePreview = async (
    mediaUri: string,
    mediaType: "image" | "video" | "audio"
  ) => {
    if (!chatId || !user?.uid) return;

    const tempId = generateTempId();
    const tempMessage: PendingMessage = {
      id: tempId,
      tempId,
      text: "",
      senderId: user.uid,
      createdAt: new Date(),
      localMediaUri: mediaUri,
      mediaType,
      isUploading: true,
      uploadProgress: 0,
    };

    setPendingMessages((prev) => [tempMessage, ...prev]);

    try {
      const mediaUrl = await uploadToCloudinary(mediaUri, mediaType);

      const messageData = {
        text: "",
        senderId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        mediaUrl,
        mediaType,
      };

      await firestore()
        .collection("chats")
        .doc(String(chatId))
        .collection("messages")
        .add(messageData);

      const lastMessageText =
        mediaType === "image"
          ? "📷 Photo"
          : mediaType === "video"
          ? "🎥 Video"
          : "🎵 Audio";

      await firestore()
        .collection("chats")
        .doc(String(chatId))
        .set(
          {
            lastMessage: {
              text: lastMessageText,
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          },
          { merge: true }
        );

      setPendingMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
    } catch (error) {
      console.error("Media send error:", error);

      setPendingMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId
            ? { ...msg, isUploading: false, error: "Upload failed" }
            : msg
        )
      );

      setTimeout(() => {
        setPendingMessages((prev) =>
          prev.filter((msg) => msg.tempId !== tempId)
        );
      }, 5000);

      Alert.alert("Error", "Failed to send media. Please try again.");
    }
  };

  const sendTextMessage = async () => {
    if (!text.trim() || !chatId || !user?.uid) return;

    const messageText = text.trim();
    const tempId = generateTempId();

    const tempMessage: PendingMessage = {
      id: tempId,
      tempId,
      text: messageText,
      senderId: user.uid,
      createdAt: new Date(),
      isUploading: true,
    };

    setText("");
    setPendingMessages((prev) => [tempMessage, ...prev]);

    try {
      await firestore()
        .collection("chats")
        .doc(String(chatId))
        .collection("messages")
        .add({
          text: messageText,
          senderId: user.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      await firestore()
        .collection("chats")
        .doc(String(chatId))
        .set(
          {
            lastMessage: {
              text: messageText,
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          },
          { merge: true }
        );

      setPendingMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
    } catch (error) {
      console.error("Text send error:", error);

      setPendingMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId
            ? { ...msg, isUploading: false, error: "Send failed" }
            : msg
        )
      );

      setTimeout(() => {
        setPendingMessages((prev) =>
          prev.filter((msg) => msg.tempId !== tempId)
        );
        setText(messageText);
      }, 3000);
    }
  };

  const retryFailedMessage = (tempId: string) => {
    const failedMsg = pendingMessages.find((msg) => msg.tempId === tempId);
    if (!failedMsg) return;

    if (failedMsg.localMediaUri && failedMsg.mediaType) {
      setPendingMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
      sendMediaWithRealTimePreview(
        failedMsg.localMediaUri,
        failedMsg.mediaType as "image" | "video" | "audio"
      );
    } else if (failedMsg.text) {
      setPendingMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
      setText(failedMsg.text);
      sendTextMessage();
    }
  };

  const AudioPlayer = ({
    uri,
    isMyMessage,
  }: {
    uri: string;
    isMyMessage: boolean;
  }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    useEffect(() => {
      return sound
        ? () => {
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);

    const playPauseAudio = async () => {
      try {
        if (sound) {
          if (isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
        } else {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true },
            (status) => {
              if (status.isLoaded) {
                setDuration(status.durationMillis || 0);
                setPosition(status.positionMillis || 0);
                setIsPlaying(status.isPlaying || false);
              }
            }
          );
          setSound(newSound);
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isMyMessage
            ? "rgba(255,255,255,0.2)"
            : colors.background,
          borderRadius: 20,
          padding: 10,
          minWidth: 200,
        }}
      >
        <TouchableOpacity onPress={playPauseAudio} style={{ marginRight: 10 }}>
          <FontAwesome
            name={isPlaying ? "pause" : "play"}
            size={16}
            color={isMyMessage ? "white" : colors.accent}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <View
            style={{
              height: 2,
              backgroundColor: isMyMessage
                ? "rgba(255,255,255,0.3)"
                : colors.border,
              borderRadius: 1,
              marginBottom: 4,
            }}
          >
            <View
              style={{
                height: "100%",
                backgroundColor: isMyMessage ? "white" : colors.accent,
                borderRadius: 1,
                width: duration > 0 ? `${(position / duration) * 100}%` : "0%",
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 10,
              color: isMyMessage
                ? "rgba(255,255,255,0.8)"
                : colors.textSecondary,
            }}
          >
            {formatDuration(position)} / {formatDuration(duration)}
          </Text>
        </View>
      </View>
    );
  };

  const renderMessage = ({
    item,
    isPending = false,
  }: {
    item: PendingMessage | Message;
    isPending?: boolean;
  }) => {
    const isMyMessage = item.senderId === user?.uid;
    const showError = isPending && (item as PendingMessage).error;
    const isUploading = isPending && (item as PendingMessage).isUploading;
    const isVideo = item.mediaType === "video";
    const isAudio = item.mediaType === "audio";

    const hasMedia = !!(
      item.mediaUrl || (item as PendingMessage).localMediaUri
    );
    const isOnlyMedia = hasMedia && !item.text; // no text, only media

    return (
      <View
        style={{
          paddingHorizontal: 5,
          paddingVertical: 4,
          flexDirection: "row",
          justifyContent: isMyMessage ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            maxWidth: "90%",
            backgroundColor: isOnlyMedia
              ? "transparent"
              : isMyMessage
              ? colors.accent
              : colors.card,
            padding: isOnlyMedia ? 0 : 10,
            borderRadius: isOnlyMedia ? 0 : 12,
            opacity: showError ? 0.6 : isUploading ? 0.8 : 1,
          }}
        >
          {(item.mediaUrl || (item as PendingMessage).localMediaUri) && (
            <View
              style={{ marginBottom: item.text ? 8 : 0, position: "relative" }}
            >
              {isAudio ? (
                <AudioPlayer
                  uri={item.mediaUrl || (item as PendingMessage).localMediaUri!}
                  isMyMessage={isMyMessage}
                />
              ) : isVideo ? (
                <Video
                  source={{
                    uri:
                      item.mediaUrl || (item as PendingMessage).localMediaUri,
                  }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 8,
                  }}
                  useNativeControls
                  resizeMode="contain"
                  shouldPlay={false}
                  isLooping={false}
                />
              ) : (
                <Image
                  source={{
                    uri:
                      item.mediaUrl || (item as PendingMessage).localMediaUri,
                  }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 8,
                    resizeMode: "cover",
                  }}
                />
              )}

              {isVideo && item.mediaUrl && !isUploading && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10 }}>🎥 Video</Text>
                </View>
              )}

              {isUploading && !isAudio && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="large" color="white" />
                  <Text style={{ color: "white", marginTop: 8, fontSize: 12 }}>
                    {isVideo
                      ? "Uploading video..."
                      : isAudio
                      ? "Uploading audio..."
                      : "Uploading..."}
                  </Text>
                </View>
              )}
            </View>
          )}

          {item.text ? (
            <Text
              style={{
                color: isMyMessage ? "white" : colors.textPrimary,
              }}
            >
              {item.text}
            </Text>
          ) : null}

          {showError && (
            <TouchableOpacity
              onPress={() =>
                retryFailedMessage((item as PendingMessage).tempId!)
              }
              style={{ marginTop: 4 }}
            >
              <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                {(item as PendingMessage).error} - Tap to retry
              </Text>
            </TouchableOpacity>
          )}

          {isUploading &&
            !item.mediaUrl &&
            !(item as PendingMessage).localMediaUri && (
              <ActivityIndicator
                size="small"
                color={isMyMessage ? "white" : colors.textSecondary}
                style={{ marginTop: 4, alignSelf: "flex-end" }}
              />
            )}

          {item.createdAt && !isUploading && (
            <Text
              style={{
                marginTop: 4,
                fontSize: 10,
                color: isMyMessage ? "#E6E6E6" : colors.textSecondary,
                textAlign: "right",
              }}
            >
              {formatTime(item.createdAt)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const MediaOptionsModal = () => (
    <Modal
      visible={showMediaOptions}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowMediaOptions(false)}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
        activeOpacity={1}
        onPress={() => setShowMediaOptions(false)}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.textPrimary,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Select Media Type
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleCameraPicker}
              style={{
                alignItems: "center",
                padding: 15,
                borderRadius: 12,
                backgroundColor: colors.background,
                minWidth: 80,
              }}
            >
              <MaterialIcons
                name="camera-alt"
                size={24}
                color={colors.accent}
              />
              <Text
                style={{
                  color: colors.textPrimary,
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleImagePicker}
              style={{
                alignItems: "center",
                padding: 15,
                borderRadius: 12,
                backgroundColor: colors.background,
                minWidth: 80,
              }}
            >
              <MaterialIcons
                name="photo-library"
                size={24}
                color={colors.accent}
              />
              <Text
                style={{
                  color: colors.textPrimary,
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDocumentPicker}
              style={{
                alignItems: "center",
                padding: 15,
                borderRadius: 12,
                backgroundColor: colors.background,
                minWidth: 80,
              }}
            >
              <MaterialIcons
                name="audiotrack"
                size={24}
                color={colors.accent}
              />
              <Text
                style={{
                  color: colors.textPrimary,
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                Audio File
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const allMessages = [...pendingMessages, ...messages];

  if (loading) {
    return (
      <CustomLoader message="Please wait while we are loading the chats" />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        inverted
        data={allMessages}
        keyExtractor={(item) => (item as PendingMessage).tempId || item.id}
        renderItem={({ item }) =>
          renderMessage({
            item,
            isPending: !!(item as PendingMessage).tempId,
          })
        }
      />

      <KeyboardAvoidingView
        style={[styles.inputBar, { borderTopColor: colors.border }]}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={
          keyboardVisible
            ? Platform.OS === "ios"
              ? 90
              : height(0.13)
            : height(0.03)
        }
      >
        {isRecording ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              backgroundColor: colors.card,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "#ff4444",
                  marginRight: 8,
                }}
              />
              <Text style={{ color: colors.textPrimary, flex: 1 }}>
                Recording... {formatDuration(recordingDuration)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={cancelRecording}
              style={{
                padding: 8,
                marginRight: 8,
              }}
            >
              <MaterialIcons
                name="close"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={stopRecording}
              style={{
                backgroundColor: colors.accent,
                borderRadius: 20,
                padding: 10,
              }}
            >
              <MaterialIcons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setShowMediaOptions(true)}
              style={styles.addButton}
            >
              <Entypo name="plus" size={18} color="#4F46E5" />
            </TouchableOpacity>

            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={t("chat.type")}
              placeholderTextColor={colors.textSecondary}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.card,
                color: colors.textPrimary,
                padding: 12,
                borderRadius: 8,
                marginHorizontal: 8,
              }}
              multiline
              maxLength={1000}
            />

            {text.trim() ? (
              <TouchableOpacity
                onPress={sendTextMessage}
                style={[styles.sendButton, { opacity: !text.trim() ? 0.5 : 1 }]}
                disabled={!text.trim()}
              >
                <Text style={styles.sendButtonText}>{t("chat.send")}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={startRecording}
                style={{
                  backgroundColor: colors.accent,
                  borderRadius: 20,
                  padding: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="mic" size={20} color="white" />
              </TouchableOpacity>
            )}
          </>
        )}
      </KeyboardAvoidingView>

      <MediaOptionsModal />
    </SafeAreaView>
  );
};

export default ChatView;
