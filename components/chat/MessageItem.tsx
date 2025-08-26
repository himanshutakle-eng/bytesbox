import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { Message } from "@/Types";
import { formatTime } from "@/utils/formateTime";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../screens/Chat/Styles";
import { FullScreenMediaViewer } from "./FullScreenMediaViewer";
import { MediaContent } from "./MediaContent";

interface PendingMessage extends Message {
  isUploading?: boolean;
  tempId?: string;
  localMediaUri?: string;
  uploadProgress?: number;
  error?: string;
  isEncrypted?: boolean;
  mediaType?: any;
  mediaUrl?: string;
}

interface MessageItemProps {
  item: PendingMessage | Message;
  isPending?: boolean;
  onRetryFailedMessage: (tempId: string) => void;
}

export const MessageItem: React.FC<MessageItemProps | any> = ({
  item,
  isPending = false,
  onRetryFailedMessage,
}) => {
  const { colors } = useThemeContext();
  const { user } = useAuthContext();

  // State for full-screen media viewer
  const [showFullScreenMedia, setShowFullScreenMedia] = useState(false);
  const [fullScreenMediaData, setFullScreenMediaData] = useState<{
    url: string;
    type: "image" | "video";
  } | null>(null);

  const isMyMessage = item.senderId === user?.uid;
  const showError = isPending && (item as PendingMessage).error;
  const isUploading = isPending && (item as PendingMessage).isUploading;

  const hasMedia = !!(item.mediaUrl || (item as PendingMessage).localMediaUri);
  const isOnlyMedia = hasMedia && !item.text;

  const handleMediaPress = (mediaUrl: string, mediaType: "image" | "video") => {
    setFullScreenMediaData({ url: mediaUrl, type: mediaType });
    setShowFullScreenMedia(true);
  };

  const closeFullScreenMedia = () => {
    setShowFullScreenMedia(false);
    setFullScreenMediaData(null);
  };

  return (
    <>
      <Pressable
        style={[
          styles.msgItem,
          { justifyContent: isMyMessage ? "flex-end" : "flex-start" },
        ]}
      >
        <View
          style={[
            styles.msgSubItem,
            {
              backgroundColor: isOnlyMedia
                ? "transparent"
                : isMyMessage
                ? colors.accent
                : colors.card,
              padding: isOnlyMedia ? 0 : 10,
              borderRadius: isOnlyMedia ? 0 : 12,
              opacity: showError ? 0.6 : isUploading ? 0.8 : 1,
            },
          ]}
        >
          <MediaContent
            mediaUrl={item.mediaUrl}
            localMediaUri={(item as PendingMessage).localMediaUri}
            mediaType={item.mediaType}
            isMyMessage={isMyMessage}
            isUploading={isUploading}
            hasText={!!item.text}
            onMediaPress={handleMediaPress}
          />

          {item.text && (
            <View style={styles.msgTxt}>
              <Text
                style={{
                  color: isMyMessage ? "white" : colors.textPrimary,
                }}
              >
                {item.text}
              </Text>

              {(item as PendingMessage).isEncrypted && (
                <View style={{ marginLeft: 4, marginBottom: 2 }}>
                  <MaterialIcons
                    name="lock"
                    size={6}
                    color={
                      isMyMessage
                        ? "rgba(255,255,255,0.7)"
                        : colors.textSecondary
                    }
                  />
                </View>
              )}
            </View>
          )}

          {showError && (
            <TouchableOpacity
              onPress={() =>
                onRetryFailedMessage((item as PendingMessage).tempId!)
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
              style={[
                styles.time,
                { color: isMyMessage ? "#E6E6E6" : colors.textSecondary },
              ]}
            >
              {formatTime(item.createdAt)}
            </Text>
          )}
        </View>
      </Pressable>

      {fullScreenMediaData && (
        <FullScreenMediaViewer
          visible={showFullScreenMedia}
          mediaUrl={fullScreenMediaData.url}
          mediaType={fullScreenMediaData.type}
          onClose={closeFullScreenMedia}
        />
      )}
    </>
  );
};
