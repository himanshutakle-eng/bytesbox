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
});

export default styles;
