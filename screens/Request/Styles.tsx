import { fontSize, width } from "@/utils/Mixings";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleBar: {
    height: width(0.1),
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: width(0.05),
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: width(0.03),
  },
  btn: {
    padding: width(0.01),
    backgroundColor: "lightgrey",
    marginRight: width(0.03),
    minWidth: width(0.18),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width(0.05),
    minHeight: width(0.07),
  },
  btntxt: {
    color: "white",
    fontSize: fontSize(0.03),
    fontWeight: "600",
  },
});

export default styles;
