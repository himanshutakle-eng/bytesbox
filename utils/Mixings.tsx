import { Dimensions } from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const height = (value: number) => {
  return value * screenHeight;
};

const width = (value: number) => {
  return value * screenWidth;
};

const fontSize = (value: number) => {
  return value * screenWidth;
};

export { fontSize, height, width };
