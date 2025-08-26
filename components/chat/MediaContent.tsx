import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface MediaContentProps {
  mediaUrl?: string;
  localMediaUri?: string;
  mediaType?: "image" | "video" | "audio";
  isMyMessage: boolean;
  isUploading?: boolean;
  hasText: boolean;
  onMediaPress?: (mediaUrl: string, mediaType: "image" | "video") => void;
}

export const MediaContent: React.FC<MediaContentProps> = ({
  mediaUrl,
  localMediaUri,
  mediaType,
  isMyMessage,
  isUploading,
  hasText,
  onMediaPress,
}) => {
  const mediaUri = mediaUrl || localMediaUri;

  if (!mediaUri || mediaType === "audio") {
    return null;
  }

  const handleMediaPress = () => {
    if (
      mediaUrl &&
      (mediaType === "image" || mediaType === "video") &&
      onMediaPress
    ) {
      onMediaPress(mediaUrl, mediaType);
    }
  };

  const renderContent = () => {
    if (mediaType === "image") {
      return (
        <TouchableOpacity
          onPress={handleMediaPress}
          disabled={isUploading || !mediaUrl}
          activeOpacity={0.8}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: mediaUri }}
              style={[styles.messageImage, hasText && styles.imageWithText]}
              contentFit="cover"
              transition={200}
            />
            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    if (mediaType === "video") {
      return (
        <TouchableOpacity
          onPress={handleMediaPress}
          disabled={isUploading || !mediaUrl}
          activeOpacity={0.8}
        >
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: mediaUri }}
              style={[styles.messageVideo, hasText && styles.videoWithText]}
              useNativeControls={false}
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
            />
            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return renderContent();
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  videoContainer: {
    position: "relative",
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  messageVideo: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  imageWithText: {
    marginBottom: 8,
  },
  videoWithText: {
    marginBottom: 8,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});
