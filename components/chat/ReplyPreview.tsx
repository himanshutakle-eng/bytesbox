// import { useThemeContext } from "@/contexts/ThemeContexts";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import React from "react";
// import { Image, Text, TouchableOpacity, View } from "react-native";

// interface ReplyMessage {
//   id: string;
//   text?: string;
//   mediaUrl?: string;
//   mediaType?: string;
//   senderId: string;
//   senderName?: string;
// }

// interface ReplyPreviewProps {
//   replyMessage: ReplyMessage;
//   onCancel: () => void;
// }

// export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
//   replyMessage,
//   onCancel,
// }) => {
//   const { colors } = useThemeContext();

//   const getMediaIcon = (mediaType: string) => {
//     if (mediaType?.includes("image")) return "image";
//     if (mediaType?.includes("video")) return "videocam";
//     if (mediaType?.includes("audio")) return "mic";
//     return "attach-file";
//   };

//   const getMediaText = (mediaType: string) => {
//     if (mediaType?.includes("image")) return "Photo";
//     if (mediaType?.includes("video")) return "Video";
//     if (mediaType?.includes("audio")) return "Audio";
//     return "File";
//   };

//   return (
//     <View
//       style={{
//         backgroundColor: colors.card,
//         borderTopWidth: 1,
//         borderTopColor: colors.border,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         flexDirection: "row",
//         alignItems: "center",
//       }}
//     >
//       {/* Reply Icon */}
//       <MaterialIcons
//         name="reply"
//         size={20}
//         color={colors.accent}
//         style={{ marginRight: 12 }}
//       />

//       {/* Reply Content */}
//       <View style={{ flex: 1 }}>
//         <View
//           style={{
//             borderLeftWidth: 3,
//             borderLeftColor: colors.accent,
//             paddingLeft: 8,
//           }}
//         >
//           {/* Sender Name */}
//           <Text
//             style={{
//               fontSize: 12,
//               fontWeight: "600",
//               color: colors.accent,
//               marginBottom: 2,
//             }}
//             numberOfLines={1}
//           >
//             {replyMessage.senderName || "Unknown"}
//           </Text>

//           {/* Reply Message Content */}
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             {replyMessage.mediaUrl && (
//               <>
//                 {replyMessage.mediaType?.includes("image") ? (
//                   <Image
//                     source={{ uri: replyMessage.mediaUrl }}
//                     style={{
//                       width: 24,
//                       height: 24,
//                       borderRadius: 4,
//                       marginRight: 8,
//                     }}
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <MaterialIcons
//                     name={getMediaIcon(replyMessage.mediaType || "")}
//                     size={14}
//                     color={colors.textSecondary}
//                     style={{ marginRight: 6 }}
//                   />
//                 )}
//               </>
//             )}

//             <Text
//               style={{
//                 fontSize: 13,
//                 color: colors.textSecondary,
//                 flex: 1,
//                 fontStyle: replyMessage.text ? "normal" : "italic",
//               }}
//               numberOfLines={1}
//             >
//               {replyMessage.text ||
//                 (replyMessage.mediaUrl
//                   ? getMediaText(replyMessage.mediaType || "")
//                   : "Message")}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Cancel Button */}
//       <TouchableOpacity
//         onPress={onCancel}
//         style={{
//           padding: 8,
//           marginLeft: 8,
//         }}
//       >
//         <MaterialIcons name="close" size={20} color={colors.textSecondary} />
//       </TouchableOpacity>
//     </View>
//   );
// };

import { useThemeContext } from "@/contexts/ThemeContexts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ReplyMessage {
  id: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  senderId: string;
  senderName?: string;
}

interface ReplyPreviewProps {
  replyMessage: ReplyMessage;
  onCancel: () => void;
  onTapReply?: () => void;
}

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  replyMessage,
  onCancel,
  onTapReply,
}) => {
  const { colors } = useThemeContext();

  const getMediaIcon = (mediaType: string) => {
    if (mediaType?.includes("image")) return "image";
    if (mediaType?.includes("video")) return "videocam";
    if (mediaType?.includes("audio")) return "mic";
    return "attach-file";
  };

  const getMediaText = (mediaType: string) => {
    if (mediaType?.includes("image")) return "Photo";
    if (mediaType?.includes("video")) return "Video";
    if (mediaType?.includes("audio")) return "Audio";
    return "File";
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        minHeight: 50,
      }}
    >
      {/* Reply Icon */}
      <MaterialIcons
        name="reply"
        size={20}
        color={colors.accent}
        style={{ marginRight: 12 }}
      />

      {/* Reply Content */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onTapReply}
        activeOpacity={0.7}
      >
        <View
          style={{
            borderLeftWidth: 3,
            borderLeftColor: colors.accent,
            paddingLeft: 8,
          }}
        >
          {/* Sender Name */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: colors.accent,
              marginBottom: 2,
            }}
            numberOfLines={1}
          >
            {replyMessage.senderName || "Unknown"}
          </Text>

          {/* Reply Message Content */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {replyMessage.mediaUrl && (
              <>
                {replyMessage.mediaType?.includes("image") ? (
                  <Image
                    source={{ uri: replyMessage.mediaUrl }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      marginRight: 8,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <MaterialIcons
                    name={getMediaIcon(replyMessage.mediaType || "")}
                    size={14}
                    color={colors.textSecondary}
                    style={{ marginRight: 6 }}
                  />
                )}
              </>
            )}

            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                flex: 1,
                fontStyle: replyMessage.text ? "normal" : "italic",
              }}
              numberOfLines={1}
            >
              {replyMessage.text ||
                (replyMessage.mediaUrl
                  ? getMediaText(replyMessage.mediaType || "")
                  : "Message")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        onPress={onCancel}
        style={{
          padding: 8,
          marginLeft: 8,
        }}
      >
        <MaterialIcons name="close" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};
