import { StyleSheet, Dimensions } from "react-native";
import {utility} from "../../../utility";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 10 * utility.deviceRatio
  },
  black: {
    width: 25 * utility.deviceRatio,
    height: 10 * utility.deviceRatio
  },
  text: {
    fontSize: 10,
    color: "#A6A6A6"
  }
});
