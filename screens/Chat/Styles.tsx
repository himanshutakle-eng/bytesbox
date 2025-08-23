import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageRow: { padding: 10 },
  inputBar: {
    flexDirection: "row",
    padding: 8,
    gap: 8,
    borderTopWidth: 1,
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
    padding: 16,
    // paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
