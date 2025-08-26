import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import React from "react";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface FullScreenMediaViewerProps {
  visible: boolean;
  mediaUrl: string;
  mediaType: "image" | "video";
  onClose: () => void;
}

export const FullScreenMediaViewer: React.FC<FullScreenMediaViewerProps> = ({
  visible,
  mediaUrl,
  mediaType,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.mediaContainer}>
          {mediaType === "image" ? (
            <Image
              source={{ uri: mediaUrl }}
              style={styles.fullScreenImage}
              contentFit="contain"
              transition={200}
            />
          ) : (
            <Video
              source={{ uri: mediaUrl }}
              style={styles.fullScreenVideo}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingTop: StatusBar.currentHeight || 44,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mediaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullScreenVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
});
