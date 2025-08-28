import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { Message } from "@/Types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../screens/Chat/Styles";
import { FullScreenMediaViewer } from "./FullScreenMediaViewer";
import { MediaContent } from "./MediaContent";
import { ReplyIndicator } from "./ReplyIndicator";

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

interface ReplyMessage {
  id: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  senderId: string;
  senderName?: string;
}

interface MessageItemProps {
  item: PendingMessage | Message;
  isPending?: boolean;
  onRetryFailedMessage: (tempId: string) => void;
  onReply?: () => void;
  isHighlighted?: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

export const MessageItem: React.FC<MessageItemProps | any> = ({
  item,
  isPending = false,
  onRetryFailedMessage,
  onReply,
  isHighlighted = false,
}) => {
  const { colors } = useThemeContext();
  const { user } = useAuthContext();

  // Animation refs
  const translateX = useRef(new Animated.Value(0)).current;
  const replyIconOpacity = useRef(new Animated.Value(0)).current;
  const replyIconScale = useRef(new Animated.Value(0.8)).current;
  const highlightOpacity = useRef(new Animated.Value(0)).current;

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
  const hasReply = !!item.replyTo;

  // Highlight animation effect
  React.useEffect(() => {
    if (isHighlighted) {
      // Start highlight animation
      Animated.sequence([
        Animated.timing(highlightOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(highlightOpacity, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(highlightOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(highlightOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isHighlighted]);

  // Swipe threshold
  const SWIPE_THRESHOLD = 60;
  const MAX_SWIPE = 100;

  // PanResponder for swipe gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to horizontal swipes
      const { dx, dy } = gestureState;
      return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
    },
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderGrant: () => {
      // Start of gesture
      translateX.setOffset(0);
    },
    onPanResponderMove: (evt, gestureState) => {
      if (!onReply || isPending) return;

      const { dx } = gestureState;
      let translationX = dx;

      if (isMyMessage && dx > 0) return;
      if (!isMyMessage && dx < 0) return;

      const maxDistance = Math.min(Math.abs(dx), MAX_SWIPE);
      translationX = dx > 0 ? maxDistance : -maxDistance;

      translateX.setValue(translationX);

      const progress = Math.min(Math.abs(translationX) / SWIPE_THRESHOLD, 1);
      replyIconOpacity.setValue(progress);
      replyIconScale.setValue(0.8 + 0.2 * progress);

      if (Math.abs(translationX) >= SWIPE_THRESHOLD && progress === 1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (!onReply || isPending) return;

      const { dx } = gestureState;

      if (Math.abs(dx) >= SWIPE_THRESHOLD) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onReply();
      }

      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(replyIconOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(replyIconScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    onPanResponderTerminate: () => {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(replyIconOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(replyIconScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
  });

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
      <View
        style={[
          styles.msgItem,
          {
            justifyContent: isMyMessage ? "flex-end" : "flex-start",
          },
        ]}
      >
        {isHighlighted && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: colors.accent,
              opacity: highlightOpacity,
              borderRadius: 12,
              zIndex: 0,
            }}
          />
        )}

        <Animated.View
          style={{
            position: "absolute",
            left: isMyMessage ? 20 : undefined,
            right: isMyMessage ? undefined : 20,
            top: "50%",
            transform: [{ translateY: -12 }, { scale: replyIconScale }],
            opacity: replyIconOpacity,
            zIndex: 0,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.textSecondary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="reply" size={16} color="white" />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateX }],
            zIndex: isHighlighted ? 1 : 1,
          }}
          {...panResponder.panHandlers}
        >
          <Pressable
            style={[
              styles.msgSubItem,
              {
                backgroundColor: isOnlyMedia
                  ? "transparent"
                  : isMyMessage
                  ? colors.accent
                  : colors.card,
                padding: isOnlyMedia ? 0 : hasReply ? 8 : 10,
                borderRadius: isOnlyMedia ? 12 : 12,
                opacity: showError ? 0.6 : isUploading ? 0.8 : 1,
              },
            ]}
          >
            {hasReply && (
              <ReplyIndicator
                replyMessage={item.replyTo}
                isMyMessage={isMyMessage}
              />
            )}

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
              <View style={[styles.msgTxt, hasReply && { marginTop: 4 }]}>
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
          </Pressable>
        </Animated.View>
      </View>

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
