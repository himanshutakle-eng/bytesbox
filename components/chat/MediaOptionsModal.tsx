import { useThemeContext } from "@/contexts/ThemeContexts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import styles from "../../screens/Chat/Styles";

interface MediaOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onAudioPress: () => void;
}

export const MediaOptionsModal: React.FC<MediaOptionsModalProps> = ({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
  onAudioPress,
}) => {
  const { colors } = useThemeContext();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.btn} activeOpacity={1} onPress={onClose}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.txt, { color: colors.textPrimary }]}>
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
              onPress={onCameraPress}
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
              onPress={onGalleryPress}
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
              onPress={onAudioPress}
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
};
