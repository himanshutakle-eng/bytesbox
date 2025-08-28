import CustomLoader from "@/components/ui/CustomLoader";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { useInstantMessage } from "@/hooks/useInstantMessage";
import { useKeyboard } from "@/hooks/useKeyboard";
import { usePresence } from "@/hooks/usePresence";
import { height } from "@/utils/Mixings";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { InstantMessageItem } from "../../components/chat/InstantMessageItem";
import { MediaOptionsModal } from "../../components/chat/MediaOptionsModal";
import { MessageInput } from "../../components/chat/MessageInput";
import { MessageItem } from "../../components/chat/MessageItem";
import { RecordingBar } from "../../components/chat/RecordingBar";
import styles from "./Styles";

interface ChatViewProps {
  otherUser?: any | null;
  loading?: boolean;
  handleImagePicker: () => void;
  handleCameraPicker: () => void;
  handleDocumentPicker: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  sendTextMessage: (text: string) => Promise<void>;
  retryFailedMessage: (tempId: string) => void;
  showMediaOptions: boolean;
  setShowMediaOptions: any;
  pendingMessages: any;
  messages: any;
  isRecording: boolean;
  recordingDuration: any;
  text: any;
  setText: any;
}

const ChatViewWithInstantMessages: React.FC<ChatViewProps> = ({
  otherUser,
  loading,
  handleImagePicker,
  handleCameraPicker,
  handleDocumentPicker,
  startRecording,
  stopRecording,
  cancelRecording,
  sendTextMessage,
  retryFailedMessage,
  showMediaOptions,
  setShowMediaOptions,
  pendingMessages,
  messages,
  isRecording,
  recordingDuration,
  text,
  setText,
}) => {
  const { colors } = useThemeContext();
  const navigation = useNavigation();
  const keyboardVisible = useKeyboard();
  const {
    instantMessages,
    addInstantMessage,
    updateMessageStatus,
    removeInstantMessage,
  } = useInstantMessage();
  usePresence();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <ChatHeader otherUser={otherUser} />,
      headerBackTitleVisible: false,
    });
  }, [otherUser]);

  const handleSendMessage = async () => {
    if (!text.trim()) return;
    const tempId = addInstantMessage(text.trim());
    const messageText = text;
    setText("");

    try {
      await sendTextMessage(messageText);
      updateMessageStatus(tempId, "sent");
      setTimeout(() => removeInstantMessage(tempId), 100);
    } catch (error) {
      updateMessageStatus(tempId, "failed");
    }
  };

  const handleRetryInstantMessage = async (
    tempId: string,
    messageText: string
  ) => {
    updateMessageStatus(tempId, "sending");
    try {
      await sendTextMessage(messageText);
      updateMessageStatus(tempId, "sent");
      setTimeout(() => removeInstantMessage(tempId), 100);
    } catch (error) {
      updateMessageStatus(tempId, "failed");
    }
  };

  const allMessages = [
    ...instantMessages,
    ...pendingMessages.filter((msg: any) => msg.mediaUrl || msg.localMediaUri),
    ...messages,
  ];

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    if (item.isInstant) {
      return (
        <InstantMessageItem
          text={item.text}
          createdAt={item.createdAt}
          status={item.status}
          onRetry={
            item.status === "failed"
              ? () => handleRetryInstantMessage(item.tempId, item.text)
              : undefined
          }
        />
      );
    }

    return (
      <MessageItem
        item={item}
        isPending={!!item.tempId && !item.isInstant}
        onRetryFailedMessage={retryFailedMessage}
      />
    );
  };

  if (loading) {
    return (
      <CustomLoader message="Please wait while we are loading the chats" />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        inverted
        data={allMessages}
        keyExtractor={(item) => item.tempId || item.id}
        renderItem={renderMessage}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={21}
      />

      <KeyboardAvoidingView
        style={[styles.inputBar, { borderTopColor: colors.border }]}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={
          keyboardVisible
            ? Platform.OS === "ios"
              ? 90
              : height(0.12)
            : height(0.03)
        }
      >
        {isRecording ? (
          <RecordingBar
            recordingDuration={recordingDuration}
            onCancel={cancelRecording}
            onStop={stopRecording}
          />
        ) : (
          <MessageInput
            text={text}
            onTextChange={setText}
            onSend={handleSendMessage}
            onStartRecording={startRecording}
            onShowMediaOptions={() => setShowMediaOptions(true)}
          />
        )}
      </KeyboardAvoidingView>

      <MediaOptionsModal
        visible={showMediaOptions}
        onClose={() => setShowMediaOptions(false)}
        onCameraPress={handleCameraPicker}
        onGalleryPress={handleImagePicker}
        onAudioPress={handleDocumentPicker}
      />
    </SafeAreaView>
  );
};

export default ChatViewWithInstantMessages;
