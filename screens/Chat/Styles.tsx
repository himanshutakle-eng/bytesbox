import { width } from "@/utils/Mixings";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageRow: { padding: 10 },
  inputBar: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: width(0.05),
    marginBottom: width(0.03),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  headerAvatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "600",
  },
  addButton: {
    padding: width(0.02),
    // paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  txtInputBar: {
    width: width(0.6),
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    // marginHorizontal: 8,
  },
  msgItem: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    flexDirection: "row",
    marginVertical: width(0.005),
  },
  msgSubItem: {
    maxWidth: "90%",
  },
  videoWrapper: {
    padding: width(0.01),
    borderRadius: width(0.03),
  },
  video: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  imageWrapper: {
    padding: width(0.01),

    borderRadius: width(0.03),
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  videoText: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mediaTxt: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  msgTxt: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  time: {
    marginTop: 4,
    fontSize: 10,
    textAlign: "right",
  },
  btn: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  card: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  txt: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default styles;
