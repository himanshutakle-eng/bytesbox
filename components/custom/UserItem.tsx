// import { width } from "@/utils/Mixings";
// import Entypo from "@expo/vector-icons/Entypo";
// import { getAuth } from "@react-native-firebase/auth";
// import React from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// type Props = {
//   index: number;
//   item: any;
//   onPress?: (id: string) => Promise<void>;
//   params?: string;
//   onAccept?: (id: string) => Promise<void>;
//   onDecline?: (id: string) => Promise<void>;
// };

// const UserItem = ({
//   item,
//   index,
//   onPress,
//   params,
//   onAccept,
//   onDecline,
// }: Props) => {
//   const currentUser = getAuth().currentUser;
//   const currentUid = currentUser?.uid;

//   const existingRequest = item?.connections?.find(
//     (conn: any) => conn.uid === currentUid && conn.toUserId === item.id
//   );

//   const isRequested = existingRequest?.status === "pending";
//   const isFriend = existingRequest?.status === "accepted";

//   return (
//     <View key={item?.id} style={styles.container}>
//       <View style={[styles.container, { paddingHorizontal: 0 }]}>
//         <View style={styles.imgWrapper}>
//           <Image
//             source={{ uri: item?.user?.profileUrl || item?.profileUrl }}
//             style={styles.img}
//           />
//         </View>
//         <View style={styles.nameContainer}>
//           <Text>{item?.user?.userName || item?.userName}</Text>
//           <Text>{item?.user?.email || item?.email}</Text>
//         </View>
//       </View>

//       {params === "user" ? (
//         <TouchableOpacity
//           disabled={isRequested || isFriend}
//           onPress={() =>
//             !isRequested && !isFriend && onPress && onPress(item?.id)
//           }
//         >
//           <Text
//             style={{
//               color: isFriend ? "green" : isRequested ? "gray" : "blue",
//             }}
//           >
//             {isFriend ? "Friends" : isRequested ? "Requested" : "Request"}
//           </Text>
//         </TouchableOpacity>
//       ) : (
//         <View style={styles.row}>
//           <TouchableOpacity
//             style={[styles.btn, { backgroundColor: "green" }]}
//             onPress={() => {
//               if (onAccept) {
//                 onAccept(item?.id);
//               }
//             }}
//           >
//             <Entypo name="check" size={20} color="white" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.btn}
//             onPress={() => {
//               if (onDecline) {
//                 onDecline(item.id);
//               }
//             }}
//           >
//             <Entypo name="cross" size={20} color="white" />
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// export default UserItem;

// const styles = StyleSheet.create({
//   img: {
//     flex: 1,
//   },
//   imgWrapper: {
//     height: width(0.1),
//     width: width(0.1),
//     borderRadius: width(0.5),
//     overflow: "hidden",
//   },
//   container: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: width(0.03),
//   },
//   nameContainer: {
//     paddingLeft: width(0.02),
//   },
//   row: {
//     display: "flex",
//     flexDirection: "row",
//     width: width(0.25),
//     justifyContent: "space-around",
//     height: "100%",
//     alignItems: "center",
//   },
//   btn: {
//     backgroundColor: "red",
//     padding: width(0.015),
//     borderRadius: width(0.5),
//   },
// });

import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContexts";
import { width } from "@/utils/Mixings";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  index: number;
  item: any;
  onPress?: (id: string) => Promise<void>;
  params?: string;
  onAccept?: (id: string) => Promise<void>;
  onDecline?: (id: string) => Promise<void>;
  onRequestAgain?: (id: string) => Promise<void>;
};

const UserItem = ({
  item,
  index,
  onPress,
  params,
  onAccept,
  onDecline,
}: Props) => {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const currentUid = user?.uid;
  const {colors} = useThemeContext()

  const existingRequest = item?.connections?.find(
    (conn: any) => conn.uid === currentUid || conn.uid === item.id
  );

  const isRequested = existingRequest?.status === "pending";
  const isFriend = existingRequest?.status === "accepted";

  const handleRequestPress = () => {
    if (isFriend) return;
    if (onPress) {
      onPress(item?.id);
    }
  };

  return (
    <View key={item?.id} style={[styles.container, {backgroundColor:colors.background}]}>
      <View style={[styles.container, { paddingHorizontal: 0 }]}>
        <View style={styles.imgWrapper}>
          <Image
            source={{ uri: item?.user?.profileUrl || item?.profileUrl }}
            style={styles.img}
          />
        </View>
        <View style={styles.nameContainer}>
          <Text style={{color:colors.text}}>{item?.user?.userName || item?.userName}</Text>
          <Text style={{color:colors.text}}>{item?.user?.email || item?.email}</Text>
        </View>
      </View>

      {params === "user" ? (
        <TouchableOpacity onPress={handleRequestPress}>
          <Text
            style={{
              color: isFriend ? "green" : isRequested ? "gray" : "blue",
            }}
          >
            {isFriend
              ? t("users.friends")
              : isRequested
              ? t("users.requested")
              : t("users.request")}
          </Text>
        </TouchableOpacity>
      ) : params === "Declined" || params === "Sent" ? null : (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "green" }]}
            onPress={() => onAccept && onAccept(item?.uid || item?.user?.id)}
          >
            <Entypo name="check" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onDecline && onDecline(item?.uid || item?.user?.id)}
          >
            <Entypo name="cross" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  img: {
    flex: 1,
  },
  imgWrapper: {
    height: width(0.1),
    width: width(0.1),
    borderRadius: width(0.5),
    overflow: "hidden",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: width(0.03),
  },
  nameContainer: {
    paddingLeft: width(0.02),
  },
  row: {
    display: "flex",
    flexDirection: "row",
    width: width(0.25),
    justifyContent: "space-around",
    height: "100%",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "red",
    padding: width(0.015),
    borderRadius: width(0.5),
  },
});
